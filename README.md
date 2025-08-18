HarakaPay - Mobile App Development Brief
Project Overview
HarakaPay is a comprehensive digital platform designed to modernize school fee payment and communication systems in Congo. The platform consists of three main components working together as a unified ecosystem:

Parent Mobile App (React Native/Expo) - What you're building
School Web Portal (React/Next.js) - Already in development
Admin Dashboard (React) - Part of the web portal system

The Mobile App Component
You'll be developing the Parent Mobile App using React Native with Expo. This is the primary interface for parents to interact with the HarakaPay ecosystem and represents a critical component of the overall system.
Key Features for Mobile App:

Multi-child support: One parent account can manage multiple children across different schools
Secure authentication with JWT integration
Fee management: View balances, payment history, and pending amounts
Instant payments via M-Pesa, Airtel Money, Orange Money, and bank transfers
Real-time notifications for announcements, reminders, and payment confirmations
Document access: Download invoices and receipts
Push notifications using Expo Push Notifications or OneSignal

System Integration Context
Your mobile app will interact with:

Centralized Backend: Supabase (PostgreSQL) for data storage and real-time updates
Payment Microservices: Node.js services handling secure payment gateway integrations
School Web Portal: Schools manage student data, configure fees, and send communications that parents receive on mobile
Admin Dashboard: Platform administrators monitor transactions and manage system-wide settings

Technical Stack Alignment
The entire HarakaPay ecosystem uses JavaScript/TypeScript:

Your Mobile App: React Native (Expo) with TypeScript
Web Portal: Next.js with React and Tailwind CSS
Backend: Node.js microservices + Supabase
Database: PostgreSQL (via Supabase) with optional MongoDB for logging

Critical Integration Points

Authentication: JWT-based auth system shared across all platform components
Real-time Communication: Parents receive instant updates when schools post announcements or payment reminders
Payment Flow: Secure payment processing through backend microservices that update both mobile app and school portal in real-time
Data Synchronization: Student information, fee structures, and payment status must stay synchronized across mobile and web interfaces

The mobile app you're building is not standalone - it's an integral part of a larger ecosystem where schools manage data through their web portal, and parents access and interact with that data through your mobile interface. Understanding this interconnected relationship is crucial for proper API integration and user experience design.