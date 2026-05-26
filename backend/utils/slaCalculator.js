// SLA targets in minutes
const SLA_TARGETS = {
  urgent: 60,      // 1 hour
  high: 240,       // 4 hours
  medium: 1440,    // 24 hours
  low: 4320        // 72 hours
};

export function calculateAgeMinutes(ticket) {
  const startTime = new Date(ticket.createdAt);
  const endTime = ticket.resolvedAt ? new Date(ticket.resolvedAt) : new Date();
  const diffMs = endTime - startTime;
  return Math.floor(diffMs / (1000 * 60));
}

export function calculateSLABreached(ticket) {
  const ageMinutes = calculateAgeMinutes(ticket);
  const slaTarget = SLA_TARGETS[ticket.priority];

  if (ticket.status === 'closed' || ticket.status === 'resolved') {
    // For resolved/closed tickets, check if it was resolved after SLA
    return ageMinutes > slaTarget;
  } else {
    // For open/in_progress, check if current time exceeds SLA
    return ageMinutes > slaTarget;
  }
}

export function enrichTicket(ticket) {
  const ticketObj = ticket.toObject ? ticket.toObject() : ticket;
  return {
    ...ticketObj,
    ageMinutes: calculateAgeMinutes(ticket),
    slaBreached: calculateSLABreached(ticket)
  };
}

export function enrichTickets(tickets) {
  return tickets.map(ticket => enrichTicket(ticket));
}

export const SLA_TARGETS as SLATargets;
