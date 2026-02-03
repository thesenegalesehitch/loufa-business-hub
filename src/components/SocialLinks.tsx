import { motion } from 'framer-motion';
import { Facebook, Instagram, MessageCircle, Mail, Ghost } from 'lucide-react';

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
  hoverColor: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    icon: <Facebook className="h-5 w-5" />,
    url: 'https://facebook.com/loufabusiness',
    color: 'bg-[#1877F2]/10 text-[#1877F2]',
    hoverColor: 'hover:bg-[#1877F2] hover:text-white',
  },
  {
    name: 'Instagram',
    icon: <Instagram className="h-5 w-5" />,
    url: 'https://instagram.com/loufabusiness',
    color: 'bg-gradient-to-br from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10 text-[#E4405F]',
    hoverColor: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white',
  },
  {
    name: 'Snapchat',
    icon: <Ghost className="h-5 w-5" />,
    url: 'https://snapchat.com/add/loufabusiness',
    color: 'bg-[#FFFC00]/10 text-[#FFFC00]',
    hoverColor: 'hover:bg-[#FFFC00] hover:text-black',
  },
  {
    name: 'WhatsApp',
    icon: <MessageCircle className="h-5 w-5" />,
    url: 'https://wa.me/221771234567',
    color: 'bg-[#25D366]/10 text-[#25D366]',
    hoverColor: 'hover:bg-[#25D366] hover:text-white',
  },
  {
    name: 'Email',
    icon: <Mail className="h-5 w-5" />,
    url: 'mailto:contact@loufabusiness.sn',
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
