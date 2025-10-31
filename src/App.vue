<script setup lang="ts"></script>

<template>
  <main>
    <router-view />
  </main>
  <footer class="footer">
    <p>
      Created by
      <a
        href="https://t.me/Surr1337"
        target="_blank"
        rel="noopener noreferrer"
      >
        <strong>Maluzhenkov Nikolay</strong>
      </a>
    </p>
  </footer>
</template>

<style scoped>
main {
  max-width: 960px;
  margin: 0 auto;
}

.footer {
  margin-top: auto;
  padding: 24px;
  text-align: center;
  border-top: 1px solid #eee;
  color: #666;
}

.footer p {
  margin: 0;
}

.footer a {
  color: var(--color-primary, #0969da);
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
