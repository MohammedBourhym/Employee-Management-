function getDateType(date) {
    const digitalDate = new Date(date);
    
    // Check if the date is valid
    
    const today = new Date();
    
    console.log (digitalDate +' ' +today)
  
    return today < digitalDate ? 'Upcoming' : 'Past';
  }
  
  console.log(getDateType('28 Oct 2024 ' + "7: 50 AM"));
  
