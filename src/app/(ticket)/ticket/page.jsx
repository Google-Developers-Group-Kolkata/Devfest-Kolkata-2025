import React from 'react'
import TicketComponent from '@/components/common/TicketComponent';

export default function TicketPage() {
  return (
    <div>
      <TicketComponent 
        title="Early Bird Ticket"
        description="I know you missed community Faris ticket. This ticket for all our valuable early people who constantly support us and create a vibrant community."
        features={[
          "Entry to DevFest",
          "Full-access to conference",
          "Breakfast & Lunch",
          "Hi-Tea",
          "Keynotes, Panels",
          "Exclusive Discussion Session",
        ]}
        price="₹ 799"
        color="blue"
      />
    </div>
  )
}
