export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // If logged in and trying to access login/register, redirect to dashboard
  if (user.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/dashboard')
  }
})
