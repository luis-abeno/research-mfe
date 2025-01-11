<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { object, string } from 'yup'
import { roles, roles_en } from '~/mock/roles'

const config = useRuntimeConfig()
const questionsStore = useQuestionsStore()
const route = useRoute()
const langRoles = route.query.lang !== 'en' ? roles : roles_en

onMounted(() => {
  async function fetchData() {
    try {
      const response = await fetch(`${config.public.apiUrl}/questions`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()

      questionsStore.questions = data
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  if (questionsStore.questions.length === 0) {
    fetchData()
  }
})

useHead({
  script: [
    {
      src: `https://www.google.com/recaptcha/api.js?render=${config.public.recaptchaSiteKey}`,
      async: true,
      defer: true,
    },
  ],
})

const toast = useToast()
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha() || {}

const options = [
  { id: 1, value: route.query.lang !== 'en' ? 'Discordo totalmente' : 'Strongly disagree' },
  { id: 2, value: route.query.lang !== 'en' ? 'Discordo' : 'Disagree' },
  { id: 3, value: route.query.lang !== 'en' ? 'Neutro' : 'Neutral' },
  { id: 4, value: route.query.lang !== 'en' ? 'Concordo' : 'Agree' },
  { id: 5, value: route.query.lang !== 'en' ? 'Concordo totalmente' : 'Strongly agree' },
]

interface Question {
  id: number
  question: string
}

const schema = object({
  fullName: string().required(route.query.lang !== 'en' ? 'Campo obrigatório' : 'Required field'),
  email: string().email(route.query.lang !== 'en' ? 'E-mail inválido' : 'Invalid email').required(route.query.lang !== 'en' ? 'Campo obrigatório' : 'Required field'),
  role: string().required(route.query.lang !== 'en' ? 'Campo obrigatório' : 'Required field'),
  whatRole: string().when('role', {
    is: (val: string | undefined) => val === '13',
    then: () => string().required(route.query.lang !== 'en' ? 'Campo obrigatório' : 'Required field'),
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
  const currentGroup = questionsStore.questions.groups[currentGroupIndex.value]
  return currentGroup.questions.every((question: Question) => state.answers[question.id])
})

const isLoading = ref(false)

function nextGroup() {
  if (currentGroupIndex.value < questionsStore.questions.groups.length - 1) {
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
    what_role: state.whatRole,
  }))

  try {
    const config = useRuntimeConfig()

    await recaptchaLoaded!()
    await executeRecaptcha!('login')

    const response = await fetch(`${config.public.apiUrl}/save-answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    })

    if (!response.ok) {
      toast.add({ title: route.query.lang !== 'en' ? 'Ops... falha ao salvar resposta' : 'Oops... failed to save response' })
    }

    toast.add({ title: route.query.lang !== 'en' ? 'Respostas enviadas com sucesso!' : 'Responses sent successfully!', timeout: 3000 })

    setTimeout(() => {
      if (route.query.lang !== 'en') {
        navigateTo('/thanks')
      }
      else {
        navigateTo('/thanks?lang=en')
      }
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
    <h1 class="text-3xl font-bold mb-4">
      {{ route.query.lang !== 'en' ? 'Explorando a transição de monolitos para micro frontends' : 'Exploring the transition from monoliths to micro frontends' }}
    </h1>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup :label="route.query.lang !== 'en' ? 'Nome completo' : 'Full Name'" name="fullName">
        <UInput v-model="state.fullName" />
      </UFormGroup>

      <UFormGroup :label="route.query.lang !== 'en' ? 'E-mail' : 'Email'" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup :label="route.query.lang !== 'en' ? 'Cargo' : 'Role'" name="role">
        <USelect v-model="state.role" :options="[{ value: '', name: route.query.lang !== 'en' ? 'Selecione' : 'Select' }, ...langRoles]" option-attribute="name" />
      </UFormGroup>

      <UFormGroup v-if="state.role === '13'" :label="route.query.lang !== 'en' ? 'Qual?' : 'What?'" name="whatRole">
        <UInput v-model="state.whatRole" />
      </UFormGroup>

      <div v-if="state.fullName && state.email && state.role" class="card">
        <h2 class="text-2xl font-bold mb-4">
          {{ route.query.lang !== 'en' ? 'Questionário' : 'Questionnaire' }}
        </h2>
        <div class="card-container">
          <transition name="fade" mode="out-in">
            <div v-if="questionsStore.questions.groups[currentGroupIndex]" :key="questionsStore.questions.groups[currentGroupIndex].name" class="card">
              <h3 class="text-xl font-semibold mb-2 underline">
                {{ route.query.lang !== 'en' ? questionsStore.questions.groups[currentGroupIndex].name : questionsStore.questions.groups[currentGroupIndex].name_en }}
              </h3>
              <div v-for="question in questionsStore.questions.groups[currentGroupIndex].questions" :key="question.id" class="mb-6">
                <p class="mb-2">
                  {{ route.query.lang !== 'en' ? question.question : question.question_en }}
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
          {{ route.query.lang !== 'en' ? 'Anterior' : 'Previous' }}
        </UButton>
        <span :class="{ 'm-auto': currentGroupIndex === 0 }">{{ currentGroupIndex + 1 }} {{ route.query.lang !== 'en' ? 'de' : 'of' }} {{ questionsStore.questions.groups.length }}</span>
        <UButton v-if="currentGroupIndex < questionsStore.questions.groups.length - 1" :disabled="!allQuestionsAnswered" @click="nextGroup">
          {{ route.query.lang !== 'en' ? 'Próximo' : 'Next' }}
        </UButton>
        <UButton v-else type="submit" class="!bg-orange-500 text-white" :disabled="!allQuestionsAnswered || isLoading">
          <span v-if="isLoading">{{ route.query.lang !== 'en' ? 'Enviando...' : 'Sending...' }}</span>
          <span v-else>{{ route.query.lang !== 'en' ? 'Enviar' : 'Submit' }}</span>
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
