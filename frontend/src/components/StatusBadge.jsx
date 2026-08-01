import React from 'react';
import { Send, Code, UserCheck, CheckCircle2, XCircle, Award } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = (st) => {
    switch (st) {
      case 'Applied':
        return { className: 'badge-applied', icon: Send, label: 'Applied' };
      case 'Online Assessment':
        return { className: 'badge-oa', icon: Code, label: 'Online Assessment' };
      case 'Technical Interview':
        return { className: 'badge-tech', icon: UserCheck, label: 'Tech Interview' };
      case 'HR Interview':
        return { className: 'badge-hr', icon: UserCheck, label: 'HR Interview' };
      case 'Selected':
        return { className: 'badge-selected', icon: Award, label: 'Selected' };
      case 'Rejected':
        return { className: 'badge-rejected', icon: XCircle, label: 'Rejected' };
      default:
        return { className: 'badge-applied', icon: Send, label: st || 'Applied' };
    }
  };

  const config = getBadgeConfig(status);
  const IconComponent = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <IconComponent size={13} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
