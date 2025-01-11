<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>
    <div class="container mx-auto">
      <div class="content-box p-6">
        <h1 class="text-3xl font-bold mb-4 text-center">
          {{ route.query.lang !== 'en' ? 'Obrigado pela sua participação! 🚀' : 'Thanks for your participation! 🚀' }}
        </h1>
        <div class="text-center flex gap-4 justify-center">
          <a href="https://github.com/luis-abeno" target="_blank" class="social-link">
            <img src="~/assets/github.png" alt="GitHub" class="social-icon">
          </a>
          <a href="https://www.linkedin.com/in/luis-henrique-abeno/" target="_blank" class="social-link">
            <img src="~/assets/linkedin.png" alt="LinkedIn" class="social-icon">
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.content-box {
    max-width: 800px;
    width: 100%;
}

.text-3xl {
    font-size: 1.875rem;
}

.font-bold {
    font-weight: 700;
}

.mb-4 {
    margin-bottom: 1rem;
}

.social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #000;
    font-weight: 500;
    margin-top: 1rem;
    margin-right: 1rem;
}

.social-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
}
</style>
