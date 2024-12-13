<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { computed, ref } from 'vue'
import { type InferType, object, string } from 'yup'
import { questions } from '~/mock/questions'
import { roles } from '~/mock/roles'

const schema = object({
  fullName: string().required('Campo obrigatório'),
  role: string().required('Campo obrigatório'),
  whatRole: string().when('role', {
    is: (val: string | undefined) => val === '12',
    then: () => string().required('Campo obrigatório'),
  }),
})

type Schema = InferType<typeof schema>

const state = reactive({
  fullName: undefined,
  role: undefined,
  whatRole: undefined,
  answers: {} as Record<string, string>,
})

const currentGroupIndex = ref(0)

const allQuestionsAnswered = computed(() => {
  const currentGroup = questions.groups[currentGroupIndex.value]
  return currentGroup.questions.every(question => state.answers[question.id])
})

function nextGroup() {
  if (currentGroupIndex.value < questions.groups.length - 1) {
    currentGroupIndex.value++
  }
}

function prevGroup() {
  if (currentGroupIndex.value > 0) {
    currentGroupIndex.value--
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
}
</script>

<template>
  <div class="p-6">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Nome completo" name="fullName">
        <UInput v-model="state.fullName" />
      </UFormGroup>

      <UFormGroup label="Cargo" name="role">
        <USelect v-model="state.role" :options="roles" option-attribute="name" />
      </UFormGroup>

      <UFormGroup v-if="state.role === '12'" label="Qual?" name="whatRole">
        <UInput v-model="state.whatRole" />
      </UFormGroup>

      <div v-if="state.fullName && state.role" class="card">
        <h2 class="text-2xl font-bold mb-4">
          Questionário
        </h2>
        <div class="card-container">
          <transition name="fade" mode="out-in">
            <div v-if="questions.groups[currentGroupIndex]" :key="questions.groups[currentGroupIndex].name" class="card">
              <h3 class="text-xl font-semibold mb-2 underline">
                {{ questions.groups[currentGroupIndex].name }}
              </h3>
              <div v-for="question in questions.groups[currentGroupIndex].questions" :key="question.id" class="mb-6">
                <p class="mb-2">
                  {{ question.question }}
                </p>
                <div class="flex space-x-4">
                  <label v-for="option in question.options" :key="option" class="flex items-center space-x-2">
                    <input v-model="state.answers[question.id]" type="radio" :name="question.id" :value="option" class="form-radio">
                    <span>{{ option }}</span>
                  </label>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div v-if="state.fullName && state.role" class="flex justify-between mt-4">
        <UButton v-if="currentGroupIndex > 0 " :disabled="currentGroupIndex === 0" variant="outline" @click="prevGroup">
          Anterior
        </UButton>
        <span :class="{ 'm-auto': currentGroupIndex === 0 }">{{ currentGroupIndex + 1 }} de {{ questions.groups.length }}</span>
        <UButton v-if="currentGroupIndex < questions.groups.length - 1" :disabled="!allQuestionsAnswered" @click="nextGroup">
          Próximo
        </UButton>
        <UButton v-else type="submit" class="!bg-orange-500 text-white" :disabled="!allQuestionsAnswered">
          Enviar
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<style scoped>
.text-2xl {
  font-size: 1.5rem;
}
.font-bold {
  font-weight: 700;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.text-xl {
  font-size: 1.25rem;
}
.font-semibold {
  font-weight: 600;
}
.flex {
  display: flex;
}
.space-x-4 > :not(:last-child) {
  margin-right: 1rem;
}
.space-x-2 > :not(:last-child) {
  margin-right: 0.5rem;
}
.form-radio {
  appearance: none;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.form-radio:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}
.card-container {
  position: relative;
  height: 100%;
}
.card {
  background-color: #535151;
  padding: 1rem;
  border-radius: 0.5rem;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
