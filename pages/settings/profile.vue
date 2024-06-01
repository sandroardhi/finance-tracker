<template>
  <div>
    <UForm :state="state" :schema="schema" @submit="handleSubmit">
      <UFormGroup class="mb-4" label="Full Name" name="name">
        <UInput v-model="state.name" type="text" />
      </UFormGroup>
      <UFormGroup
        class="mb-4"
        label="Email"
        name="email"
        help="You will receive a confirmation email on both your old and new email."
      >
        <UInput v-model="state.email" type="email" />
      </UFormGroup>
      <UButton label="Save" color="black" :loading="pending" type="submit" />
    </UForm>
  </div>
</template>

<script setup>
import { z } from "zod";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);

const state = ref({
  name: user.value.user_metadata?.full_name,
  email: user.value.email,
});

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
});
const handleSubmit = async () => {
  pending.value = true;

  try {
    const data = {
      // object data iki gae metdata user lek nak supabase, email iku gak melbu metadata 
      data: {
        full_name: state.value.name
      }
    }
    if(state.value.email !== user.value.email) {
      data.email = state.value.email
    }
    const { error } = await supabase.auth.updateUser(data);

    if (error) throw error;

    toastSuccess({
      title: "Profile updated"
    })
  } catch (error) {
    toastError({
      title: "Error updating profile",
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>

<style></style>
