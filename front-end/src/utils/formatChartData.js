export const getWeekDays = () => {
  const today = new Date();

  const days = [
    'Niedziela',
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
  ];

  const labels = [];
  for (let i = 0; i < 7; i++) {
    const pastDate = new Date(
      today.setDate(today.getDate() - (i === 0 ? 0 : 1))
    );
    labels.push(days[pastDate.getDay()]);
  }
  return labels.reverse();
};

export const formatData = (data, dataType = 'spendings') => {
  const today = new Date();
  const formatedData = [];

  for (let i = 0; i < 7; i++) {
    const pastDate = new Date(
      today.setDate(today.getDate() - (i === 0 ? 0 : 1))
    );

    //* Format data
    const day = pastDate.getDate().toString().padStart(2, '0');

    if (data[day]) {
      formatedData.push(+data[day][0][dataType]);
    } else formatedData.push(0);
  }

  return formatedData.reverse();
};
