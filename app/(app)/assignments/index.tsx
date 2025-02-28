import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Calendar, Clock, MapPin, User } from 'lucide-react-native';

const mockAssignments = [
  {
    id: '1',
    service: 'Full Detail',
    client: 'Tesla Motors',
    employee: 'John Doe',
    time: '09:00 AM',
    location: 'North Service Bay',
    status: 'scheduled',
  },
  {
    id: '2',
    service: 'Express Wash',
    client: 'BMW Dealership',
    employee: 'Jane Smith',
    time: '10:30 AM',
    location: 'South Service Bay',
    status: 'in-progress',
  },
  {
    id: '3',
    service: 'Interior Clean',
    client: 'Mercedes-Benz',
    employee: 'Mike Johnson',
    time: '02:00 PM',
    location: 'Detail Center',
    status: 'completed',
  },
];

export default function Assignments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#007AFF';
      case 'in-progress':
        return '#FF9500';
      case 'completed':
        return '#34C759';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendar}>
        {weekDays.map((date) => (
          <TouchableOpacity
            key={date.toISOString()}
            style={[
              styles.dateCard,
              isSameDay(date, selectedDate) && styles.dateCardSelected,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[
              styles.dayName,
              isSameDay(date, selectedDate) && styles.dateTextSelected,
            ]}>
              {format(date, 'EEE')}
            </Text>
            <Text style={[
              styles.dayNumber,
              isSameDay(date, selectedDate) && styles.dateTextSelected,
            ]}>
              {format(date, 'd')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Calendar size={20} color="#666" />
            <Text style={styles.headerDate}>
              {format(selectedDate, 'MMMM d, yyyy')}
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ New Assignment</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.assignmentsList}>
          {mockAssignments.map((assignment) => (
            <TouchableOpacity key={assignment.id} style={styles.assignmentCard}>
              <View style={styles.assignmentHeader}>
                <Text style={styles.serviceName}>{assignment.service}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(assignment.status) + '15' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(assignment.status) }
                  ]}>
                    {assignment.status}
                  </Text>
                </View>
              </View>

              <View style={styles.assignmentDetails}>
                <View style={styles.detailRow}>
                  <User size={16} color="#666" />
                  <Text style={styles.detailText}>{assignment.client}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={16} color="#666" />
                  <Text style={styles.detailText}>{assignment.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.detailText}>{assignment.location}</Text>
                </View>
              </View>

              <View style={styles.assignmentFooter}>
                <View style={styles.employeeTag}>
                  <View style={styles.employeeAvatar}>
                    <Text style={styles.avatarText}>
                      {assignment.employee.split(' ')[0][0]}
                    </Text>
                  </View>
                  <Text style={styles.employeeName}>{assignment.employee}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  calendar: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateCard: {
    width: 55,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  dateCardSelected: {
    backgroundColor: '#007AFF',
  },
  dayName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  dateTextSelected: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  assignmentsList: {
    flex: 1,
  },
  assignmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  assignmentDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#666',
    fontSize: 14,
  },
  assignmentFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  employeeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  employeeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  employeeName: {
    fontSize: 14,
    color: '#666',
  },
});