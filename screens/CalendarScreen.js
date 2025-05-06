import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { calendarStyles as styles } from './stylesC'; // import the styles

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState({
    '2025-05-10': { marked: true, dotColor: '#4CAF50', activeOpacity: 0 },
    '2025-05-12': { marked: true, selected: true, selectedColor: '#4CAF50' },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="calendar-today" size={28} color="#4CAF50" />
        <Text style={styles.headerText}>Calendar</Text>
      </View>

      <View style={styles.calendarBox}>
        <Calendar
          markedDates={markedDates}
          onDayPress={(day) => {
            const date = day.dateString;
            setMarkedDates((prev) => ({
              ...prev,
              [date]: {
                selected: true,
                selectedColor: '#4CAF50',
              },
            }));
          }}
          theme={{
            selectedDayBackgroundColor: '#4CAF50',
            todayTextColor: '#4CAF50',
            arrowColor: '#4CAF50',
            textMonthFontWeight: 'bold',
          }}
        />
      </View>
    </View>
  );
}
