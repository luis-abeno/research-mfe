<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { computed, onMounted, reactive, ref } from 'vue'
import { type InferType, object, string } from 'yup'
import { roles } from '~/mock/roles'

const toast = useToast()

const options = [
  { id: 1, value: 'Discordo totalmente' },
  { id: 2, value: 'Discordo' },
  { id: 3, value: 'Neutro' },
  { id: 4, value: 'Concordo' },
  { id: 5, value: 'Concordo totalmente' },
]

interface Group {
  id: number
  name: string
  questions: Question[]
}

interface Question {
  id: number
  question: string
}

const questions = ref() as Ref<{ groups: Group[] }>

onMounted(() => {
  const config = useRuntimeConfig()

  async function fetchData() {
    try {
      const response = await fetch(`${config.public.apiUrl}/questions`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()

      questions.value = data
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  fetchData()
})

const schema = object({
  fullName: string().required('Campo obrigatório'),
  email: string().email('E-mail inválido').required('Campo obrigatório'),
  role: string().required('Campo obrigatório'),
  whatRole: string().when('role', {
    is: (val: string | undefined) => val === '12',
    then: () => string().required('Campo obrigatório'),
  }),
})

const state = reactive({
  fullName: undefined,
  email: undefined,
  role: undefined,
  whatRole: undefined,
  answers: {} as Record<string, string>,
})

const currentGroupIndex = ref(0)

const allQuestionsAnswered = computed(() => {
  const currentGroup = questions.value.groups[currentGroupIndex.value]
  return currentGroup.questions.every(question => state.answers[question.id])
})

const isLoading = ref(false)

function nextGroup() {
  if (currentGroupIndex.value < questions.value.groups.length - 1) {
    currentGroupIndex.value++
  }
}

function prevGroup() {
  if (currentGroupIndex.value > 0) {
    currentGroupIndex.value--
  }
}

async function onSubmit() {
  isLoading.value = true
  const answers = Object.entries(state.answers).map(([id, answer]) => ({
    id_question: Number(id),
    answer,
    full_name: state.fullName,
    email: state.email,
    role: state.role,
  }))

  try {
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiUrl}/save-answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    })

    if (!response.ok) {
      toast.add({ title: 'Ops... falha ao salvar resposta' })
    }

    toast.add({ title: 'Respostas enviadas com sucesso!', timeout: 3000 })

    setTimeout(() => {
      navigateTo('/thanks')
    }, 3000)
  }
  catch (error) {
    console.error('Error saving answers:', error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="p-6">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Nome completo" name="fullName">
        <UInput v-model="state.fullName" />
      </UFormGroup>

      <UFormGroup label="E-mail" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Cargo" name="role">
        <USelect v-model="state.role" :options="[{ value: '', name: 'Selecione' }, ...roles]" option-attribute="name" />
      </UFormGroup>

      <UFormGroup v-if="state.role === '12'" label="Qual?" name="whatRole">
        <UInput v-model="state.whatRole" />
      </UFormGroup>

      <div v-if="state.fullName && state.email && state.role" class="card">
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
                  <label v-for="option in options" :key="option.id" class="flex items-center space-x-2">
                    <input v-model="state.answers[question.id]" type="radio" :name="question.id.toString()" :value="option" class="form-radio">
                    <span>{{ option.value }}</span>
                  </label>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div v-if="state.fullName && state.email && state.role" class="flex justify-between mt-4">
        <UButton v-if="currentGroupIndex > 0 " :disabled="currentGroupIndex === 0" variant="outline" @click="prevGroup">
          Anterior
        </UButton>
        <span :class="{ 'm-auto': currentGroupIndex === 0 }">{{ currentGroupIndex + 1 }} de {{ questions.groups.length }}</span>
        <UButton v-if="currentGroupIndex < questions.groups.length - 1" :disabled="!allQuestionsAnswered" @click="nextGroup">
          Próximo
        </UButton>
        <UButton v-else type="submit" class="!bg-orange-500 text-white" :disabled="!allQuestionsAnswered || isLoading">
          <span v-if="isLoading">Enviando...</span>
          <span v-else>Enviar</span>
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
