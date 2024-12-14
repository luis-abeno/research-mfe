import { defineStore } from 'pinia'

export const useQuestionsStore = defineStore('questions', {
  state: () => ({
    questions: [] as any,
  }),
  actions: {
    setQuestions(data: any) {
      this.questions = data
    },
  },
})
