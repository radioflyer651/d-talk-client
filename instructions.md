

# Instructions

## Common Services
Use the following services to find and store application data.

  - src\app\services\chat-core\agent-configuration.service.ts
  - src\app\services\chat-core\api-client.service.ts
  - src\app\services\chat-core\chat-model-config.service.ts
  - src\app\services\chat-core\projects.service.ts
  - src\app\services\chat-core\chat-jobs.service.ts
  - src\app\services\chat-core\chat-rooms.service.ts

## Components Used For Example
Use the following files for reference when designing new components.

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