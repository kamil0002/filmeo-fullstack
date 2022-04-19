export default (birthDate) =>
  Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);
