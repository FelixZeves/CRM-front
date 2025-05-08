<script setup>
    const props = defineProps(['name', 'description', 'date', 'status'])
    import { StatusEnum } from './Enums.vue'
</script>

<template>
    <div class="task grid grid-cols-4 gap-x-1">
        <div class="mainInfo col-span-2">
            <p class="text-base lg:text-lg font-medium mb-0">{{ name }}</p>
            <p class="text-sm lg:text-base mb-0">{{ description }}</p>
        </div>
        <p class="date text-sm lg:text-base mb-0">{{ date || "---------" }}</p>
        <div class="status cursor-help" :class="StatusEnum[props.status].color">
            <q-tooltip
            anchor="top middle"
            self="bottom middle"
            max-width="200px"
            :offset="[10, 10]"
            class="!text-sm text-center"
            :class="StatusEnum[props.status].color, StatusEnum[props.status].textColor">
                {{ StatusEnum[status].description }}
            </q-tooltip>
        </div>
    </div>
</template>

<style>

.task{
    justify-self: center;
    border-radius: 10pt;
    width: 95%;
    height: 55px;
}

.task:hover{
    background-color: var(--vt-c-white-mute);
    transition: 0.5s;
}

.task .mainInfo{
    padding-left: 5%;
    align-self: center;
}

.task .date{
    text-align: center;
    align-self: center;
}

.task .status{
    justify-self: center;
    align-self: center;
    height: 20px;
    width: 20px;
    border-radius: 20pt;
}

.task .status-danger{
    background-color: var(--crm-c-danger);
}

.task .status-wait{
    background-color: var(--crm-c-light-yellow);
}

.task .status-complete{
    background-color: var(--crm-c-complete);
}

</style>