export const dateConverter = (date) =>
  `${new Date(date).toLocaleDateString()} - ${new Date(
    date
  ).toLocaleTimeString()}`;
