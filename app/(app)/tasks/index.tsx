import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Car, Clock, MapPin, CircleCheck as CheckCircle2, CircleAlert as AlertCircle } from 'lucide-react-native';

const mockTasks = [
  {
    id: '1',
    service: 'Full Detail',
    client: 'Tesla Motors',
    vehicle: 'Model 3',
    time: '10:00 AM',
    location: 'Bay 1',
    status: 'in-progress',
    notes: 'Focus on interior cleaning',
  },
  {
    id: '2',
    service: 'Express Wash',
    client: 'BMW Dealership',
    vehicle: 'X5',
    time: '11:30 AM',
    location: 'Bay 2',
    status: 'pending',
    notes: 'Customer requested extra wax',
  },
  {
    id: '3',
    service: 'Interior Clean',
    client: 'Mercedes-Benz',
    vehicle: 'C-Class',
    time: '2:00 PM',
    location: 'Bay 3',
    status: 'completed',
    notes: 'Leather treatment required',
  },
];

type TaskStatus = 'pending' | 'in-progress' | 'completed';

export default function Tasks() {
  const [selectedFilter, setSelectedFilter] = useState<TaskStatus | 'all'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9500';
      case 'in-progress':
        return '#007AFF';
      case 'completed':
        return '#34C759';
      default:
        return '#666';
    }
  };

  const filteredTasks = selectedFilter === 'all'
    ? mockTasks
    : mockTasks.filter(task => task.status === selectedFilter);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.filterContainer}>
          {(['all', 'pending', 'in-progress', 'completed'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.filterButtonTextActive
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.taskList}>
          {filteredTasks.map((task) => (
            <TouchableOpacity key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={styles.serviceType}>
                  <Car size={20} color="#007AFF" />
                  <Text style={styles.serviceTypeText}>{task.service}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(task.status)}15` }
                ]}>
                  {task.status === 'completed' ? (
                    <CheckCircle2 size={16} color={getStatusColor(task.status)} />
                  ) : (
                    <AlertCircle size={16} color={getStatusColor(task.status)} />
                  )}
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(task.status) }
                  ]}>
                    {task.status}
                  </Text>
                </View>
              </View>

              <View style={styles.taskInfo}>
                <Text style={styles.clientName}>{task.client}</Text>
                <Text style={styles.vehicleName}>{task.vehicle}</Text>
                
                <View style={styles.detailRow}>
                  <Clock size={16} color="#666" />
                  <Text style={styles.detailText}>{task.time}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.detailText}>{task.location}</Text>
                </View>
              </View>

              {task.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesText}>{task.notes}</Text>
                </View>
              )}

              {task.status !== 'completed' && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: getStatusColor(task.status) }
                  ]}
                >
                  <Text style={styles.actionButtonText}>
                    {task.status === 'pending' ? 'Start Service' : 'Complete Service'}
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
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
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  taskList: {
    padding: 15,
    gap: 15,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceTypeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskInfo: {
    gap: 8,
    marginBottom: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
  },
  vehicleName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
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
  notesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesText: {
    color: '#666',
    fontSize: 14,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});