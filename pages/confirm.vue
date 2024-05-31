<template>
  <div>
    <UCard>
      <template #header> Signing in... </template>
      <p>Please wait while we sign you in...</p>
    </UCard>
  </div>
</template>

<script setup>
useRedirectIfAuthenticated()

</script>

<style></style>
