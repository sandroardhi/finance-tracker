<template>
  <div>
    <div class="mb-4">
      <UFormGroup
        label="Current avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar
          :src="url"
          size="3xl"
        />
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup
        label="New avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to actually upload the new avatar"
      >
        <UInput type="file" ref="fileInput" />
      </UFormGroup>
    </div>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
// We need to get the actual avatar URL
const { toastSuccess, toastError } = useAppToast();
const uploading = ref(false);
const fileInput = ref(); // Reference to an input with ref="fileInput" attribute
const {url} = useAvatarUrl()


const saveAvatar = async () => {
  const file = fileInput.value.input.files[0];
  if (!file) {
    return toastError({
      title: "Please select an image to upload first.",
      description: "Make sure that the uploaded file is an image.",
    });
  }

  // rename the image file
  const fileExtension = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExtension}`;

  try {
    uploading.value = true;

    const currentAvatarUrl = user.value.user_metadata?.avatar_url;
    const { error } = await supabase.storage
      // ini nama bucket di supabase e
      .from("avatars")
      .upload(fileName, file);

    if (error) throw error;

    //habise upload file, kita hubungin si filename e ke metadata user yg upload td
    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });

    // ini delete previous avatar lek misale ada
    if(currentAvatarUrl) {
      const {error} = await supabase.storage
        .from("avatars")
        .remove([currentAvatarUrl])

      if(error) throw error
    }

    // kosongin file input
    fileInput.value.input.value = null;
    toastSuccess({
      title: "Avatar uploaded",
    });
  } catch (error) {
    toastError({
      title: "Error uploading avatar",
      description: error.message,
    });
  } finally {
    uploading.value = false;
  }
};
</script>
