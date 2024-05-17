const formatDate = (date: Date): string => {
  date = date && new Date(date) || new Date();
  return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
}
   
export default formatDate;