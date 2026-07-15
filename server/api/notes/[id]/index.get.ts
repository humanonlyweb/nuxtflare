export default defineEventHandler((event) => {
  const { notesController } = createContainer(event);
  return notesController.get(event);
});
