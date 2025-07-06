

# Instructions

## Common Services
Use the following services to find and store application data.

  - src\app\services\chat-core\api-client.service.ts
    - Contains all methods for API calls to the server.
  - src\app\services\chat-core\projects.service.ts
    - Holds the current project for the application.
    - Holds list of projects for the current user.
  - src\app\services\chat-core\chat-rooms.service.ts
    - Holds the currently selected chat room, and a list of chat rooms for the currently selected project.
  - src\app\services\chat-core\agent-configuration.service.ts
    - Holds the current agent configuration, and a list of agent configurations for the currently selected project.
  - src\app\services\chat-core\chat-jobs.service.ts
    - Holds the currently selected chat job (configurations), and a list of chat job (configurations) for the currently selected project.
  - src\app\services\chat-core\chat-model-config.service.ts
    - Contains methods for working with chat model configurations.
    - This is more of a service that performs actions, rather than holding data.
  - src\app\services\chat-core\agent-instance.service.ts
    - Contains methods for working with chat agent instances.

## Important Models
The following are the core model files which form the major parts of the data for the application.

  - src\model\shared-models\chat-core\agent-configuration.model.ts
  - src\model\shared-models\chat-core\agent-instance-configuration.model.ts
  - src\model\shared-models\chat-core\agent-reference.model.ts
  - src\model\shared-models\chat-core\chat-job-data.model.ts
  - src\model\shared-models\chat-core\chat-job-instance.model.ts
  - src\model\shared-models\chat-core\chat-room-busy-state.model.ts
  - src\model\shared-models\chat-core\chat-room-data.model.ts
  - src\model\shared-models\chat-core\chat-room-event.model.ts
  - src\model\shared-models\chat-core\chat-room-events.model.ts
  - src\model\shared-models\chat-core\message-speaker.model.ts
  - src\model\shared-models\chat-core\model-service-params.model.ts
  - src\model\shared-models\chat-core\plugin-instance-reference.model.ts
  - src\model\shared-models\chat-core\plugin-specification.model.ts
  - src\model\shared-models\chat-core\positionable-message.model.ts
  - src\model\shared-models\chat-core\project-listing.model.ts
  - src\model\shared-models\chat-core\project.model.ts

## Components Used For Example
Use the following files for reference when designing new components.

The files listed below should be read for reference.  They are relative to the project root folder.

### List Components
  - Chat Job List
    - src\app\components\chat-core\chat-jobs\chat-job-list\chat-job-list.component.ts
    - src\app\components\chat-core\chat-jobs\chat-job-list\chat-job-list.component.scss
    - src\app\components\chat-core\chat-jobs\chat-job-list\chat-job-list.component.html
  - Agent Configurations
    - src\app\components\chat-core\agent-configurations\agent-config-list\agent-config-list.component.html
    - src\app\components\chat-core\agent-configurations\agent-config-list\agent-config-list.component.scss
    - src\app\components\chat-core\agent-configurations\agent-config-list\agent-config-list.component.ts
  - Projects List
    - src\app\components\chat-core\projects\project-list\project-list.component.html
    - src\app\components\chat-core\projects\project-list\project-list.component.scss
    - src\app\components\chat-core\projects\project-list\project-list.component.ts

### Detail Components
  - Chat Job List
    - src\app\components\chat-core\chat-jobs\chat-job-detail\chat-job-detail.component.html
    - src\app\components\chat-core\chat-jobs\chat-job-detail\chat-job-detail.component.scss
    - src\app\components\chat-core\chat-jobs\chat-job-detail\chat-job-detail.component.ts
  - Agent Configurations
    - src\app\components\chat-core\agent-configurations\agent-config-detail\agent-config-detail.component.html
    - src\app\components\chat-core\agent-configurations\agent-config-detail\agent-config-detail.component.scss
    - src\app\components\chat-core\agent-configurations\agent-config-detail\agent-config-detail.component.ts
  - Projects List
    - src\app\components\chat-core\projects\project-detail\project-detail.component.html
    - src\app\components\chat-core\projects\project-detail\project-detail.component.scss
    - src\app\components\chat-core\projects\project-detail\project-detail.component.ts

## Chat Room Details Component

We need to give the user access to the following:
  - List of Chat Jobs, defined in the owning project.
  - List of Chat Agents, defined in the owning project.

Using these, they will create the following:
  - List of Chat Agents, instantiated from Chat Agents found in the owning project.
  - List of Chat Jobs, instantiated from the Chat Jobs in the owning project.

Finally, they need to assign agents from step 2 to chat jobs in step 2.