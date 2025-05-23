<template>
    <RouterView />
</template>

<style>
.text-brand-danger {
  color: #DC1919 !important;
}
.bg-brand-danger {
  background: #DC1919 !important;
}

.text-brand-wait {
  color: #FCCE42 !important;
}
.bg-brand-wait {
  background: #FCCE42 !important;
}

.text-brand-complete {
  color: #14DC14 !important;
}
.bg-brand-complete {
  background: #14DC14 !important;
}

.q-table__card{
  @apply !rounded-[10pt]
}

.q-table tbody tr td {
  @apply text-base
}

.q-table thead tr th {
  @apply text-base font-bold border-b-2
}

.submit-btn{
  @apply !bg-[--crm-c-light-velvet] !w-1/4 !rounded-[5pt] !text-white;
}

.q-field__messages, .q-table__bottom{
    @apply !text-base
}

.gray-menu{
    @apply !bg-[--vt-c-white-mute] !rounded-[10pt] border-[0.5pt] border-[--crm-c-medium-gray] text-lg
}

</style>
