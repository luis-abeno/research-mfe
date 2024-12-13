<template>
  <div>
    <div class="container mx-auto">
      <div class="content-box p-6">
        <h1 class="text-3xl font-bold mb-4">
          Explorando a transição de monolitos para micro frontends
        </h1>
        <p class="mb-4">
          Olá! Seja bem-vindo!
        </p>
        <p class="mb-4">
          Este questionário tem como finalidade compreender como as organizações estão abordando a transformação de sistemas monolíticos para a arquitetura de micro frontends. O foco é investigar os impactos dessa mudança, tanto no desenvolvimento técnico quanto na organização das equipes envolvidas, especialmente em cenários onde a modularidade e a colaboração são fundamentais.
        </p>
        <p class="mb-4">
          A adoção de micro frontends representa uma mudança significativa na maneira como as aplicações são estruturadas, permitindo que equipes trabalhem de forma independente em diferentes partes do sistema. Essa abordagem pode influenciar a dinâmica interna e os processos de tomada de decisão, além de promover maior escalabilidade e agilidade no desenvolvimento.
        </p>
        <p class="mb-4">
          O objetivo deste questionário é coletar informações para fins de pesquisa, que servirão como base para a elaboração de um trabalho acadêmico. As respostas refletem exclusivamente as experiências e opiniões dos profissionais da área, sendo avaliadas por meio de uma escala Likert. Ressaltamos que não há respostas certas ou erradas.
        </p>
        <p class="mb-4">
          E não se preocupe, todas as informações fornecidas serão tratadas de forma confidencial e anônima, garantindo a privacidade dos participantes.
        </p>
        <p class="mb-4">
          Agradecemos sua colaboração!
        </p>
        <NuxtLink to="/questions">
          <UButton class="bg-blue-500 text-white">
            Iniciar Pesquisa
          </UButton>
        </NuxtLink>
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
</style>
