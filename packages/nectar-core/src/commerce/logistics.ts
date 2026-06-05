export type ShipmentStatus = 
  | 'Ordered' 
  | 'Confirmed' 
  | 'Packed' 
  | 'Shipped' 
  | 'In Transit' 
  | 'Out For Delivery' 
  | 'Delivered';

export interface TrackingMilestone {
  id: string;
  status: ShipmentStatus;
  date: string;
  location?: string;
  description: string;
  isCompleted: boolean;
}

export interface Shipment {
  id: string; // The tracking ID
  orderId: string;
  carrier: string;
  estimatedDelivery: string;
  currentStatus: ShipmentStatus;
  milestones: TrackingMilestone[];
}

export const MockLogisticsService = {
  getShipment: async (id: string): Promise<Shipment | null> => {
    // Return a mock shipment for tracking ID 'TRK-12345'
    if (id === 'TRK-12345' || id.startsWith('PR-')) {
      return {
        id: 'TRK-12345',
        orderId: id.startsWith('PR-') ? id : 'PR-882931',
        carrier: 'FedEx Express Priority',
        estimatedDelivery: '2024-10-24T18:00:00Z',
        currentStatus: 'In Transit',
        milestones: [
          {
            id: 'm1',
            status: 'Ordered',
            date: '2024-10-18T09:42:00Z',
            location: 'Warehouse, Mumbai Distribution Center',
            description: 'Order Processed',
            isCompleted: true
          },
          {
            id: 'm2',
            status: 'Shipped',
            date: '2024-10-20T14:15:00Z',
            location: 'Carrier: FedEx Express Priority',
            description: 'Shipped',
            isCompleted: true
          },
          {
            id: 'm3',
            status: 'In Transit',
            date: '2024-10-21T23:30:00Z',
            location: 'Sort Facility, New Delhi',
            description: 'In Transit - Arrived at Facility',
            isCompleted: true
          },
          {
            id: 'm4',
            status: 'Out For Delivery',
            date: '',
            location: '',
            description: 'Pending',
            isCompleted: false
          },
          {
            id: 'm5',
            status: 'Delivered',
            date: '',
            location: '',
            description: 'Pending',
            isCompleted: false
          }
        ]
      }
    }
    return null;
  }
};
