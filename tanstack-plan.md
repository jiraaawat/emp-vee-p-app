# TanStack Implementation Plan สำหรับ MVP HR/Workflow

> สำหรับโปรเจกต์ emp-vee-p-demo ใช้กับแนวทาง Modular Monolith (Next.js + NestJS + PostgreSQL)

---

## 1. ทำไมใช้ TanStack?

| ปัญหาใน HR App | TanStack ที่ใช้แก้ |
|----------------|---------------------|
| ข้อมูลจาก API เปลี่ยนบ่อย (Clock In/Out, สถานะคำขอ) | **TanStack Query** — sync server state, cache, refetch อัตโนมัติ |
| ตารางพนักงาน/รายงานมีข้อมูลเยอะ | **TanStack Table** — filter, sort, pagination, column visibility |
| ฟอร์ม OT, เบิกเงิน, ลา มี validation ซับซ้อน | **TanStack Form** — type-safe, async validation, field arrays |
| Routing หลายบทบาท (Admin, Manager, Employee) | **TanStack Router** — type-safe routing (optional) |
| รายการยาว เช่น ประวัติการ Clock In | **TanStack Virtual** — render แค่ส่วนที่มองเห็น |

---

## 2. TanStack Stack ที่ใช้ใน MVP

### Core (แนะนำใช้ทุกส่วน)
```bash
# Data Fetching
npm install @tanstack/react-query

# Tables
npm install @tanstack/react-table

# Forms
npm install @tanstack/react-form

# Router (เลือกใช้ ถ้าอยากลอง type-safe routing)
npm install @tanstack/react-router
```

### ทางเลือก (ใช้ตามความจำเป็น)
- `@tanstack/react-virtual` — รายการยาว
- `@tanstack/react-ranger` — date range picker แบบง่าย

---

## 3. โครงสร้างโปรเจกต์

```
emp-vee-p-demo/
├── apps/
│   ├── web/                    # Next.js 14+ Admin + Manager + Employee Web
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router
│   │   │   ├── components/
│   │   │   │   ├── ui/         # shadcn/ui components
│   │   │   │   ├── forms/      # TanStack Form wrappers
│   │   │   │   ├── tables/     # TanStack Table wrappers
│   │   │   │   └── query/      # QueryClientProvider
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useAttendance.ts
│   │   │   │   ├── useOtRequests.ts
│   │   │   │   ├── useExpenseRequests.ts
│   │   │   │   └── useLeaveRequests.ts
│   │   │   ├── lib/
│   │   │   │   ├── api.ts      # Axios/Fetch instance
│   │   │   │   ├── queryClient.ts
│   │   │   │   └── types.ts
│   │   │   └── providers.tsx
│   │   ├── package.json
│   │   └── tailwind.config.ts
│   └──
│   └── liff/                   # Line LIFF (อาจใช้ Next.js หรือ Vite)
│       └── ... (ใช้ TanStack Form + Query เหมือนกัน)
├── packages/
│   ├── shared-types/           # TypeScript types ที่ใช้ร่วม
│   ├── ui/                     # UI components ร่วม
│   └── eslint-config/
├── package.json
└── turbo.json                  # Turborepo
```

---

## 4. การใช้ TanStack Query

### 4.1 Query Keys ที่ใช้
```ts
export const queryKeys = {
  organizations: ['organizations'] as const,
  employees: (orgId: string) => ['organizations', orgId, 'employees'] as const,
  employee: (orgId: string, id: string) => ['organizations', orgId, 'employees', id] as const,
  attendance: (orgId: string, params?: object) => ['organizations', orgId, 'attendance', params] as const,
  otRequests: (orgId: string, params?: object) => ['organizations', orgId, 'ot-requests', params] as const,
  expenseRequests: (orgId: string, params?: object) => ['organizations', orgId, 'expense-requests', params] as const,
  leaveRequests: (orgId: string, params?: object) => ['organizations', orgId, 'leave-requests', params] as const,
}
```

### 4.2 Custom Hooks ตัวอย่าง
```ts
// hooks/useAttendance.ts
export function useAttendanceSummary(orgId: string, month: string) {
  return useQuery({
    queryKey: queryKeys.attendance(orgId, { month }),
    queryFn: () => api.get(`/organizations/${orgId}/attendance?month=${month}`),
    enabled: !!orgId && !!month,
  })
}

export function useClockIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ClockInInput) => api.post('/attendance/clock-in', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance() })
    },
  })
}
```

### 4.3 Optimistic Updates สำหรับ Approval
```ts
export function useApproveOtRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/ot-requests/${id}`, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.otRequests() })
      const previous = queryClient.getQueryData(queryKeys.otRequests())
      queryClient.setQueryData(queryKeys.otRequests(), (old: any) =>
        old?.map((item: any) => item.id === id ? { ...item, status } : item)
      )
      return { previous }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(queryKeys.otRequests(), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.otRequests() })
    },
  })
}
```

---

## 5. การใช้ TanStack Table

### 5.1 ตารางที่ต้องมี
- รายชื่อพนักงาน
- สรุปการเข้า-ออกรายเดือน
- รายการขอ OT / เบิกเงิน / ลา รออนุมัติ
- รายงานต้นทุน

### 5.2 ตัวอย่าง Employee Table
```tsx
// components/tables/EmployeeTable.tsx
const columns = [
  columnHelper.accessor('employee_code', {
    header: 'รหัสพนักงาน',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('full_name', {
    header: 'ชื่อ-สกุล',
  }),
  columnHelper.accessor('department.name', {
    header: 'แผนก',
  }),
  columnHelper.accessor('status', {
    header: 'สถานะ',
    cell: info => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'จัดการ',
    cell: ({ row }) => <EmployeeActions employee={row.original} />,
  }),
]

export function EmployeeTable({ data }: { data: Employee[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div>
      <Input
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="ค้นหาพนักงาน..."
      />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}
```

---

## 6. การใช้ TanStack Form

### 6.1 ฟอร์มหลัก
- ขอ OT
- ขอเบิกเงิน
- แจ้งลา
- ข้อมูลพนักงาน

### 6.2 ตัวอย่าง OT Form
```tsx
// components/forms/OtRequestForm.tsx
export function OtRequestForm() {
  const form = useForm({
    defaultValues: {
      otDate: '',
      startTime: '',
      endTime: '',
      rateType: '1.5',
      projectId: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      await createOtRequest(value)
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <form.Field
        name="otDate"
        validators={{
          onChange: ({ value }) => !value ? 'กรุณาเลือกวันที่' : undefined,
        }}
        children={(field) => (
          <div>
            <Label>วันที่ทำ OT</Label>
            <Input
              type="date"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors && (
              <span className="text-red-500">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      />
      <Button type="submit" disabled={form.state.isSubmitting}>
        ส่งคำขอ
      </Button>
    </form>
  )
}
```

### 6.3 Field Arrays สำหรับเบิกหลายรายการ
```tsx
<form.Field
  name="items"
  mode="array"
  children={(field) => (
    <div>
      {field.state.value.map((item, i) => (
        <div key={i}>
          <form.SubField
            name={`items[${i}].category`}
            children={(subField) => (
              <Select
                value={subField.state.value}
                onChange={(v) => subField.handleChange(v)}
              />
            )}
          />
          <form.SubField
            name={`items[${i}].amount`}
            children={(subField) => (
              <Input
                type="number"
                value={subField.state.value}
                onChange={(e) => subField.handleChange(Number(e.target.value))}
              />
            )}
          />
        </div>
      ))}
      <Button onClick={() => field.pushValue({ category: '', amount: 0 })}>
        + เพิ่มรายการ
      </Button>
    </div>
  )}
/>
```

---

## 7. TanStack Router (Optional)

ถ้าใช้ Next.js App Router อยู่แล้ว อาจไม่จำเป็นต้องใช้ TanStack Router แต่ถ้าอยากทำ LIFF ด้วย Vite หรือแยก SPA สำหรับบางส่วน ใช้ได้ดี

```tsx
// ตัวอย่าง Route Tree
const rootRoute = createRootRoute()
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
})
const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employees',
  component: EmployeesPage,
})
```

---

## 8. Data Flow แบบสมบูรณ์

```
User กรอกฟอร์ม OT (TanStack Form)
        ↓
validate ฝั่ง client
        ↓
submit → API (NestJS/FastAPI)
        ↓
return 200 + new OT request
        ↓
TanStack Query invalidate ot-requests key
        ↓
UI อัปเดตอัตโนมัติ (รายการใหม่ปรากฏ)
        ↓
หัวหน้างาน Approve (TanStack Table + Optimistic Update)
        ↓
Push Notification ผ่าน Line
```

---

## 9. Roadmap การ Implement TanStack

### Phase 1: Setup (Week 1)
- [ ] ติดตั้ง `@tanstack/react-query`
- [ ] ตั้งค่า QueryClient + Provider
- [ ] สร้าง `queryKeys` และ `api.ts`
- [ ] ติดตั้ง `@tanstack/react-table` + สร้าง `DataTable` wrapper
- [ ] ติดตั้ง `@tanstack/react-form`

### Phase 2: Core Features (Week 2-4)
- [ ] สร้าง custom hooks สำหรับ auth, employees, attendance
- [ ] สร้าง Employee Table (CRUD)
- [ ] สร้าง Attendance Summary Table
- [ ] สร้าง Clock In/Out component + mutation

### Phase 3: Request Flows (Week 5-8)
- [ ] OT Request Form + Table + Approval
- [ ] Expense Request Form (Field Arrays) + Approval
- [ ] Leave Request Form + Approval
- [ ] Optimistic Updates สำหรับ approval actions

### Phase 4: Reports & Polish (Week 9-12)
- [ ] Dashboard ด้วย TanStack Table สรุปข้อมูล
- [ ] Export CSV/Excel จาก Table
- [ ] TanStack Virtual สำหรับรายการยาว
- [ ] Caching strategy + prefetching

---

## 10. Best Practices

1. **อย่าใช้ Query เก็บ Local State** — Form state ใช้ TanStack Form, UI state ใช้ useState
2. **ใช้ Mutation สำหรับทุกการเขียนข้อมูล** — ไม่ fetch เอง
3. **Invalidation ให้ถูก Key** — อัปเดตรายการหลังจาก mutation
4. **Optimistic Update เฉพาะที่ UX ต้องการ** — เช่น approve/reject
5. **Type Safety** — ใช้ TypeScript ให้ครบทั้ง Query options, Form schema, Table data
6. **Error Handling** — แสดง toast/error จาก mutation error
7. **Loading State** — ใช้ `isPending` ของ Query/Form ให้ครบ

---

## 11. ตัวอย่าง Command เริ่มต้น

```bash
# 1. สร้าง monorepo
npx create-turbo@latest emp-vee-p-demo

# 2. เข้าไปใน web app
cd emp-vee-p-demo/apps/web

# 3. ติดตั้ง TanStack
npm install @tanstack/react-query @tanstack/react-table @tanstack/react-form

# 4. ติดตั้ง shadcn/ui
npx shadcn-ui@latest init

# 5. สร้าง components ที่ต้องใช้
npx shadcn-ui@latest add table button input select badge
```

---

## สรุป

TanStack จะช่วยให้ MVP ของคุณมี **data fetching ที่มีประสิทธิภาพ ตารางที่ยืดหยุ่น และฟอร์มที่ปลอดภัย** ซึ่งเหมาะมากกับระบบ HR ที่มีข้อมูลเปลี่ยนแปลงบ่อยและต้องแสดงผลเป็นรายงาน

หากต้องการให้ผมเริ่ม scaffold โปรเจกต์นี้ให้เลย บอกได้ครับ
