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

import { getDbShipmentByOrderId } from '../db/db';

export const MockLogisticsService = {
  getShipment: async (id: string): Promise<Shipment | null> => {
    // 1. Fetch from Database
    if (typeof window === 'undefined') {
      const shipment = await getDbShipmentByOrderId(id);
      if (shipment) return shipment as any;
    }

    // 2. Client fallback
    try {
      const res = await fetch(`/api/logistics/shipments/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("MockLogisticsService.getShipment fetch failed, returning client fallback", e);
    }
    
    return null;
  }
};
