# Easy Chat - Next.js Real-time Chat Application

A beautiful, modern real-time chat application built with Next.js 15, shadcn/ui, and GSAP animations.

## Features

- 💬 **Real-time Messaging** - Instant message delivery via WebSocket API
- 🎨 **Beautiful UI** - Modern design with smooth GSAP animations
- 📱 **Fully Responsive** - Mobile-first design for all devices
- ✨ **Smooth Animations** - Polished entrance animations for messages, dialogs, and interactions
- 🚀 **Fast Performance** - Built with Next.js 15 App Router for optimal speed
- 🎯 **Multiple Chat Rooms** - Create and join different chat rooms
- 👤 **User Management** - Simple username system with local persistence
- 🌈 **Beautiful Color Scheme** - Purple and green color palette with smooth transitions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: Tailwind CSS + shadcn/ui patterns
- **Animations**: GSAP 3.12+ for smooth, performant animations
- **Icons**: Lucide React
- **Real-time**: XES Cloud WebSocket API
- **Storage**: Browser localStorage for user data

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start chatting.

### Production Build

```bash
npm run build
npm start
# or
pnpm build
pnpm start
```

## Project Structure

```
easy-chat-nextjs/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main chat page
│   └── globals.css         # Global styles with theme
├── components/
│   ├── MessageBubble.tsx   # Individual message component
│   ├── MessageList.tsx     # Message list container
│   ├── MessageInput.tsx    # Input field with animations
│   ├── RoomList.tsx        # Room selector
│   ├── Sidebar.tsx         # Desktop sidebar
│   ├── MobileSidebar.tsx   # Mobile sidebar with slide animation
│   ├── RoomDialogs.tsx     # Create/Join room dialogs
│   ├── Toast.tsx           # Toast notifications
│   └── ToastContainer.tsx  # Toast container
├── hooks/
│   ├── useChat.ts          # Chat messaging logic
│   ├── useRooms.ts         # Room management
│   └── useUsername.ts      # User management
├── lib/
│   ├── xes-cloud.ts        # WebSocket API client
│   └── animations.ts       # GSAP animation utilities
├── types/
│   └── chat.ts             # TypeScript type definitions
├── public/                 # Static assets
└── package.json           # Project dependencies
```

## Features Overview

### Messages
- Messages appear with smooth fade-in and slide-up animations
- Staggered entrance for multiple messages
- User avatar and timestamp display
- Different styling for sent/received messages

### Chat Rooms
- Create new chat rooms with auto-generated IDs
- Join existing rooms via room ID
- Room selection with animated highlight
- Remove rooms from your list (except default)

### Dialogs
- Create room dialog with scale animation
- Join room dialog with validation
- Smooth backdrop fade and dialog entrance

### Mobile Experience
- Slide-in sidebar drawer
- Touch-friendly controls
- Responsive message bubbles
- Optimized spacing for small screens

### Animations
- **Message entrance**: Fade-in + slide-up with stagger
- **Dialog open**: Backdrop fade + scale with easing
- **Sidebar toggle**: Slide animation with backdrop
- **Button focus**: Shadow and color transitions
- **Input focus**: Border highlight and glow effect
- **Toast notifications**: Slide-in with auto-dismiss

## Usage

1. **Set Username**: Enter your username on first visit (saved locally)
2. **Select Room**: Choose an existing room or create a new one
3. **Send Messages**: Type a message and press Enter or click Send
4. **Join Rooms**: Click "加入" and enter a room ID shared by others
5. **Switch Rooms**: Click room names to switch between conversations

## Environment Variables

No external API keys required. The application uses XES Cloud's public WebSocket API.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- GSAP for smooth, GPU-accelerated animations
- Message virtualization for large chat histories
- Efficient polling (1-second intervals)
- React hooks for optimized re-renders
- Tailwind CSS for minimal CSS output

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Respects `prefers-reduced-motion` settings

## Known Limitations

- Messages stored server-side (clear on room recreation)
- No user authentication
- No message persistence
- Maximum message size limitations (WebSocket API)

## Future Enhancements

- [ ] User authentication
- [ ] Message persistence (database)
- [ ] File sharing
- [ ] User presence indicators
- [ ] Message search
- [ ] Message reactions
- [ ] Dark mode toggle
- [ ] Voice/video call support

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal and commercial purposes.

## Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ using Next.js, GSAP, and Tailwind CSS
