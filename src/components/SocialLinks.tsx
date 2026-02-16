import { motion } from 'framer-motion';
import { Facebook, Instagram, MessageCircle, Mail, Ghost, X, Send } from 'lucide-react';

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
  hoverColor: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'X',
    icon: <X className="h-5 w-5" />,
    url: 'https://x.com/loufapro95?s=21',
    color: 'bg-black/10 text-black',
    hoverColor: 'hover:bg-black hover:text-white',
  },
  {
    name: 'Instagram',
    icon: <Instagram className="h-5 w-5" />,
    url: 'https://www.instagram.com/loufa_pro_95',
    color: 'bg-gradient-to-br from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10 text-[#E4405F]',
    hoverColor: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white',
  },
  {
    name: 'Facebook',
    icon: <Facebook className="h-5 w-5" />,
    url: 'https://www.facebook.com/share/1cbGpdY382/?mibextid=wwXIfr',
    color: 'bg-[#1877F2]/10 text-[#1877F2]',
    hoverColor: 'hover:bg-[#1877F2] hover:text-white',
  },
  {
    name: 'TikTok',
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>,
    url: 'https://www.tiktok.com/@loufapro214',
    color: 'bg-black/10 text-black',
    hoverColor: 'hover:bg-black hover:text-white',
  },
  {
    name: 'Telegram',
    icon: <Send className="h-5 w-5" />,
    url: 'https://t.me/loufa_pro95',
    color: 'bg-[#0088cc]/10 text-[#0088cc]',
    hoverColor: 'hover:bg-[#0088cc] hover:text-white',
  },
  {
    name: 'Snapchat',
    icon: <Ghost className="h-5 w-5" />,
    url: 'https://snapchat.com/t/NH956bqP',
    color: 'bg-[#FFFC00]/10 text-[#FFFC00]',
    hoverColor: 'hover:bg-[#FFFC00] hover:text-black',
  },
  {
    name: 'WhatsApp',
    icon: <MessageCircle className="h-5 w-5" />,
    url: 'https://wa.me/c/221767558976',
    color: 'bg-[#25D366]/10 text-[#25D366]',
    hoverColor: 'hover:bg-[#25D366] hover:text-white',
  },
  {
    name: 'Email',
    icon: <Mail className="h-5 w-5" />,
    url: 'mailto:loufaparfums3@gmail.com',
    color: 'bg-primary/10 text-primary',
    hoverColor: 'hover:bg-primary hover:text-primary-foreground',
  },
];

interface SocialLinksProps {
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export function SocialLinks({ size = 'md', showLabels = false, className = '' }: SocialLinksProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            ${sizeClasses[size]} 
            rounded-full 
            flex items-center justify-center 
            transition-all duration-300 
            ${social.color} 
            ${social.hoverColor}
            ${showLabels ? 'px-4 w-auto gap-2' : ''}
          `}
          title={social.name}
        >
          {social.icon}
          {showLabels && <span className="text-sm font-medium">{social.name}</span>}
        </motion.a>
      ))}
    </div>
  );
}

export function SocialLinksVertical({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ x: 10 }}
          className={`
            flex items-center gap-3 p-3 rounded-xl
            transition-all duration-300 
            ${social.color} 
            ${social.hoverColor}
          `}
        >
          {social.icon}
          <span className="font-medium">{social.name}</span>
        </motion.a>
      ))}
    </div>
  );
}
