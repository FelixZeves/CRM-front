<script setup>
import { computed } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    direction: {
        type: String,
        default: 'y',
        validator: (val) => ['x', 'y'].includes(val)
    },
    stagger: {
        type: Number,
        default: 100
    },
    tag: {
        type: String,
        default: 'div'
    }
});

const enterFromClass = computed(() =>
  props.direction === 'x' ? 'opacity-0 translate-x-8' : 'opacity-0 translate-y-8'
)

const defaultPosition = computed(() => 
    props.direction === 'x' ? 'opacity-100 translate-x-0' : 'opacity-100 translate-y-0'
)

const leaveToClass = computed(() =>
    props.direction === 'x' ? 'opacity-0 translate-x-8' : 'opacity-0 translate-y-8'
)

</script>

<template>
    <component :is="tag" v-bind="$attrs">
      <transition-group
        :name="'fade'"
        :tag="tag"
        :class="$attrs.class"
        enter-active-class="transition ease-out duration-500"
        :enter-from-class="enterFromClass"
        :enter-to-class="defaultPosition"
        leave-active-class="transition ease-in duration-500"
        :leave-from-class="defaultPosition"
        :leave-to-class="leaveToClass"
      >
      <template v-for="(item, index) in items" :key="item.id || index">
        <slot
            :item="item"
            :index="index"
            :style="{
            transitionDelay: `${index * stagger}ms`,
            transitionProperty: 'opacity, transform'
            }"/>
        </template>
      </transition-group>
    </component>
</template>