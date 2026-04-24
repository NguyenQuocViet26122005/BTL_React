# Cap nhat he thong dong bo du lieu

## Van de da phat hien:
1. Tin tuyen dung moi khong hien tren trang viec lam
2. Dashboard khong cap nhat so don ung tuyen

## Giai phap da thuc hien:

### 1. Tao Event Bus System
- File: `BTL_UI/react-project/src/utils/eventBus.ts`
- Cho phep cac component giao tiep voi nhau
- Cac event:
  - JOB_CREATED: Khi tao tin moi
  - JOB_UPDATED: Khi cap nhat tin
  - JOB_DELETED: Khi xoa tin
  - APPLICATION_SUBMITTED: Khi nop don ung tuyen
  - APPLICATION_UPDATED: Khi cap nhat don
  - INTERVIEW_CREATED: Khi tao lich phong van
  - INTERVIEW_UPDATED: Khi cap nhat lich

### 2. Cap nhat CompanyDashboard
- Them fetch applications thuc te
- Hien thi so don ung tuyen chinh xac
- Emit events khi tao/sua/xoa tin
- Listen events de tu dong refresh

### 3. Can cap nhat them:

#### JobListPage
- Them import eventBus
- Listen JOB_CREATED, JOB_UPDATED, JOB_DELETED
- Tu dong refresh khi co tin moi

#### JobDetailPage  
- Emit APPLICATION_SUBMITTED sau khi nop don thanh cong
- Giup dashboard tu dong cap nhat

#### MyApplicationsPage
- Listen APPLICATION_SUBMITTED
- Tu dong refresh danh sach don

#### InterviewSchedulePage
- Emit INTERVIEW_CREATED khi tao lich
- Emit INTERVIEW_UPDATED khi cap nhat

## Code can them vao JobDetailPage:

```typescript
import { eventBus, EVENTS } from '../../utils/eventBus';

// Trong handleSubmitApplication, sau khi submit thanh cong:
if (response.success) {
  message.success('Nop don ung tuyen thanh cong!');
  eventBus.emit(EVENTS.APPLICATION_SUBMITTED);
  setIsModalOpen(false);
  form.resetFields();
}
```

## Code can them vao JobListPage:

```typescript
import { eventBus, EVENTS } from '../../utils/eventBus';

useEffect(() => {
  fetchJobs();
  loadFilterData();

  const handleJobChange = () => {
    fetchJobs();
    loadFilterData();
  };

  eventBus.on(EVENTS.JOB_CREATED, handleJobChange);
  eventBus.on(EVENTS.JOB_UPDATED, handleJobChange);
  eventBus.on(EVENTS.JOB_DELETED, handleJobChange);

  return () => {
    eventBus.off(EVENTS.JOB_CREATED, handleJobChange);
    eventBus.off(EVENTS.JOB_UPDATED, handleJobChange);
    eventBus.off(EVENTS.JOB_DELETED, handleJobChange);
  };
}, []);
```

## Ket qua:
- Dashboard hien thi so don ung tuyen chinh xac
- Trang viec lam tu dong cap nhat khi co tin moi
- Tat ca cac trang tu dong dong bo voi nhau
