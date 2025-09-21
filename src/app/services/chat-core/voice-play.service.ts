import { Injectable } from '@angular/core';
import { Subscription, BehaviorSubject, fromEvent } from 'rxjs';
import { VoiceService } from './voice.service';
import { StoredMessage } from '@langchain/core/messages';
import { ObjectId } from 'mongodb';

@Injectable({
  providedIn: 'root'
})
export class VoicePlayService {
  constructor(
    readonly voiceService: VoiceService,
  ) { }

  private audio: HTMLAudioElement | null = null;
  private objectUrl: string | null = null;
  private eventSub: Subscription | null = null;

  private _isPlaying = new BehaviorSubject<boolean>(false);
  isPlaying$ = this._isPlaying.asObservable();

  private _progress = new BehaviorSubject<number>(0); // seconds
  progress$ = this._progress.asObservable();

  private _duration = new BehaviorSubject<number>(0); // seconds
  duration$ = this._duration.asObservable();

  async play(source: string | Blob | ArrayBuffer, options: { autoplay?: boolean; volume?: number; } = {}) {
    const { autoplay = true, volume = 1.0 } = options;

    // Stop any existing playback and cleanup
    this.stop();

    let url: string;
    if (typeof source === 'string') {
      url = source;
    } else if (source instanceof Blob) {
      url = URL.createObjectURL(source);
      this.objectUrl = url;
    } else if (source instanceof ArrayBuffer) {
      const blob = new Blob([source], { type: 'audio/wav' });
      url = URL.createObjectURL(blob);
      this.objectUrl = url;
    } else {
      throw new Error('Unsupported audio source');
    }

    this.audio = new Audio(url);
    this.audio.preload = 'auto';
    this.audio.volume = Math.max(0, Math.min(1, volume));

    // wire events
    this.eventSub = new Subscription();

    const onPlay = fromEvent(this.audio, 'play').subscribe(() => this._isPlaying.next(true));
    const onPause = fromEvent(this.audio, 'pause').subscribe(() => this._isPlaying.next(false));
    const onEnded = fromEvent(this.audio, 'ended').subscribe(() => this.handleEnd());
    const onTime = fromEvent(this.audio, 'timeupdate').subscribe(() => {
      if (!this.audio) {
        return;
      }
      this._progress.next(this.audio.currentTime || 0);
      // duration may be NaN until metadata loaded
      this._duration.next(isFinite(this.audio.duration) ? this.audio.duration : 0);
    });

    this.eventSub.add(onPlay);
    this.eventSub.add(onPause);
    this.eventSub.add(onEnded);
    this.eventSub.add(onTime);

    try {
      if (autoplay) {
        await this.audio.play();
      }
    } catch (err) {
      // Play may fail without user gesture
      console.warn('Play failed (user gesture required?):', err);
    }
  }

  get isPlaying() {
    return this._isPlaying.value;
  }

  private handleEnd() {
    // cleanup but leave subjects in a sensible state
    this._isPlaying.next(false);
    this._progress.next(0);
    this._duration.next(0);
    this.cleanupAudio();
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  resume() {
    if (this.audio) {
      return this.audio.play();
    }
    return Promise.resolve();
  }

  stop() {
    if (!this.audio) {
      return;
    }
    try {
      this.audio.pause();
      this.audio.currentTime = 0;
    } catch (e) {
      console.warn('Error stopping audio', e);
    }
    this._isPlaying.next(false);
    this._progress.next(0);
    this._duration.next(0);
    this.cleanupAudio();
  }

  setVolume(v: number) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, v));
    }
  }

  getCurrentSrc(): string | null {
    if (this.audio) {
      return this.audio.src;
    }
    return null;
  }

  async fetchAndPlayWav(url: string, fetchOptions: RequestInit = {}) {
    // If the file is private or requires headers, fetch as Blob and play
    const resp = await fetch(url, fetchOptions);

    if (!resp.ok) {
      throw new Error(`Failed to fetch audio: ${resp.status}`);
    }

    const blob = await resp.blob();

    return this.play(blob, { autoplay: true });
  }

  private cleanupAudio() {
    if (this.eventSub) {
      this.eventSub.unsubscribe();
      this.eventSub = null;
    }
    if (this.objectUrl) {
      try {
        URL.revokeObjectURL(this.objectUrl);
      } catch {
        /* ignore */
      }
      this.objectUrl = null;
    }
    if (this.audio) {
      try {
        this.audio.src = '';
      } catch {
        /* ignore */
      }
      this.audio = null;
    }
  }

  async playMessage(chatRoomId: ObjectId, message: StoredMessage, forceRegeneration: boolean) {
    const messageUrl = await this.voiceService.getVoiceUrl(chatRoomId, message, forceRegeneration);

    if (!messageUrl) {
      return;
    }

    if (this._isPlaying.value) {
      this.stop();
    }

    await this.fetchAndPlayWav(messageUrl, {});
  }
}
