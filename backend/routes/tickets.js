import express from 'express';
import Ticket from '../models/Ticket.js';
import { enrichTicket, enrichTickets, calculateSLABreached } from '../utils/slaCalculator.js';

const router = express.Router();

// Create a new ticket
router.post('/', async (req, res) => {
  try {
    const { subject, description, customerEmail, priority } = req.body;

    // Validation
    if (!subject || !description || !customerEmail || !priority) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const ticket = new Ticket({
      subject,
      description,
      customerEmail,
      priority
    });

    await ticket.save();
    res.status(201).json(enrichTicket(ticket));
  } catch (error) {
    if (error.message.includes('Invalid status transition')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

// Get all tickets with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, priority, breached } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    let tickets = await Ticket.find(query).sort({ createdAt: -1 });
    tickets = enrichTickets(tickets);

    // Filter by breached status if requested
    if (breached === 'true') {
      tickets = tickets.filter(t => t.slaBreached);
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ticket by ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(enrichTicket(ticket));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ticket status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Validate transition
    const validTransitions = {
      'open': ['in_progress'],
      'in_progress': ['resolved', 'open'],
      'resolved': ['closed', 'in_progress'],
      'closed': []
    };

    if (!validTransitions[ticket.status].includes(status)) {
      return res.status(400).json({
        error: `Invalid status transition from ${ticket.status} to ${status}`
      });
    }

    // Handle resolvedAt field
    if (status === 'resolved' && ticket.status !== 'resolved') {
      ticket.resolvedAt = new Date();
    } else if (status === 'in_progress' && ticket.status === 'resolved') {
      ticket.resolvedAt = null;
    }

    ticket.status = status;
    await ticket.save();

    res.json(enrichTicket(ticket));
  } catch (error) {
    if (error.message.includes('Invalid status transition')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

// Delete ticket
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    const enrichedTickets = enrichTickets(tickets);

    const statusCounts = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };

    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    };

    let breachedOpen = 0;

    enrichedTickets.forEach(ticket => {
      statusCounts[ticket.status]++;
      priorityCounts[ticket.priority]++;

      if ((ticket.status === 'open' || ticket.status === 'in_progress') && ticket.slaBreached) {
        breachedOpen++;
      }
    });

    res.json({
      statusCounts,
      priorityCounts,
      breachedOpen,
      totalTickets: tickets.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
