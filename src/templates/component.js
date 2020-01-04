export const componentSkeleton = route => {
  return `<template>
<div>
  <h1>Welcome to: ${route.name}</h1>
</div>
</template>

<script>
export default {
  //
}
</script>
`;
};
