// format
export function formatdateHDMY(dateString) {
    const dateObj = new Date(dateString);
    const yyyy = dateObj.getFullYear();
    let mm = dateObj.getMonth() + 1; // Months start at 0!
    let dd = dateObj.getDate();
    // 👇️ With PM / AM
  const withPmAm = dateObj.toLocaleTimeString('en-US', {
    // en-US can be set to 'default' to use user's browser settings
    hour: '2-digit',
    minute: '2-digit',
  });
  
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm; 
  
    return `${withPmAm} ${dd}/${mm}/${yyyy}`;
  
  }
  