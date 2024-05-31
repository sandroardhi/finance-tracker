<template>
  <div>
    <UCard v-if="!success">
      <template #header> Sign-in to Finance Tracker </template>

      <form @submit.prevent="handleLogin">
        <UFormGroup
          label="email"
          name="email"
          class="mb-4"
          required
          help="You will receive an email with the comfirmation link"
        >
          <UInput type="email" required v-model="email" />
        </UFormGroup>

        <UButton :loading="pending" label="Submit" type="submit" color="black" variant="solid" />
      </form>
    </UCard>
    <UCard v-else>
      <template #header> Email has been sent! </template>

      <div class="text-center">
        <p class="text-xl mb-5">We have sent an email for <span class="font-extrabold">{{email}}. </span>Check your email and click on the link to sign-in.</p>
        <p class="text-sm">
          <strong>Important: </strong> The link will expire in 5 minutes.
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const email = ref(undefined);
const success = ref(false);
const pending = ref(false)
const {toastError, toastSuccess} = useAppToast()
const supabase = useSupabaseClient()

useRedirectIfAuthenticated()


const handleLogin = async () => {
  pending.value = true

  try {
    const {error}  = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm'
      }
    })
    if(error) {
      toastError({
        title: 'Error authenticating',
        description: error.message,
      })
    } else {
      success.value = true
    }
  } finally {
    pending.value = false
  }
}
</script>

<style></style>
