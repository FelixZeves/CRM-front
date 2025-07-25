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

.text-brand-velvet {
  color: #825AFF !important;
}

.bg-brand-velvet {
  background: #825AFF !important;
}

.text-brand-grey {
  color: #F2F2F2 !important;
}

.bg-brand-grey {
  background: #F2F2F2 !important
}

.q-table thead tr th {
  @apply !text-lg text-stone-800 !font-semibold !z-10 !sticky top-0 !bg-white
}

.q-table tbody tr td {
  @apply !text-base text-stone-700 !font-medium
}

.q-table__bottom{
  @apply !text-lg text-stone-700
}

.submit-btn{
  @apply !bg-[--crm-c-light-velvet] !w-1/4 !rounded-[5pt] !text-white;
}

.q-field__bottom{
  @apply !text-base text-stone-600
}

.gray-menu{
    @apply !bg-[--vt-c-white-mute] !rounded-[10pt] border-[0.5pt] border-[--crm-c-medium-gray] text-lg
}

.q-btn, .q-dropdown {
  @apply !rounded-[5pt] !normal-case !text-base
}

.q-input {
  @apply !text-lg
}

.bg-tile {
  @apply bg-[#f7f7f7]
}

.q-card{
  @apply !bg-white !rounded-[15pt]
}

.brand-title{
  @apply !text-xl text-stone-800 !font-semibold
}

.brand-description{
  @apply !text-lg text-stone-700 !font-medium
}

.brand-text{
  @apply !text-base !text-stone-600 !font-semibold
}

.q-chip{
  @apply !rounded-[5pt]
}

</style>
