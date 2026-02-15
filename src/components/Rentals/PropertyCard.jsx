import React, { useState } from 'react';
import { MoreVertical, MapPin, User, DollarSign, Calendar, Trash2, Edit3, Eye } from 'lucide-react';
import { tenantStatuses } from '../../constants';

const PropertyCard = ({ property, onEdit, onDelete, onViewDetails }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    const statusObj = tenantStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'text-slate-400';
  };

  const getStatusLabel = (status) => {
    const statusObj = tenantStatuses.find(s => s.value === status);
    return statusObj ? statusObj.label : 'Unknown';
  };

  const getDaysUntilExpiration = () => {
    if (!property.tenant?.leaseEnd) return null;
    const leaseEnd = new Date(property.tenant.leaseEnd);
    const today = new Date();
    const diffTime = leaseEnd - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = getDaysUntilExpiration();

  return (
    <div
      className="relative bg-slate-700/50 border border-white/15 rounded-xl overflow-hidden hover:shadow-lg transition group cursor-pointer"
      onClick={() => onViewDetails(property)}
    >
      {/* Compact photo/gradient strip */}
      <div className={`h-20 bg-gradient-to-br ${property.color || 'from-slate-600 to-slate-700'} flex items-center justify-center overflow-hidden`}>
        {property.photo ? (
          <img src={property.photo} alt={property.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-3xl opacity-60">{property.emoji || '🏠'}</div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Header with menu */}
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{property.name}</h3>
            {property.street && (
              <div className="flex items-center gap-1 text-slate-400 text-xs truncate">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{property.street}{property.city ? `, ${property.city}` : ''}</span>
              </div>
            )}
          </div>

          {/* 3-dot Menu */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-1 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-slate-800/95 border border-white/15 rounded-xl shadow-xl z-50 min-w-max overflow-hidden">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(property); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-white/10 transition text-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onViewDetails(property); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-white/10 transition text-sm border-t border-white/10"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(property.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 transition text-sm border-t border-white/10"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tenant row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
            {property.tenant?.name ? (
              <>
                <span className="text-white/80 truncate">{property.tenant.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full font-medium ${getStatusColor(property.tenant.status)}`}>
                  {getStatusLabel(property.tenant.status)}
                </span>
              </>
            ) : (
              <span className="text-slate-500 italic">Vacant</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-semibold flex-shrink-0 ml-2">
            <DollarSign className="w-3 h-3" />
            <span>{property.monthlyRent?.toLocaleString() || '0'}/mo</span>
          </div>
        </div>

        {/* Lease warning */}
        {daysLeft !== null && daysLeft <= 60 && (
          <div className="flex items-center gap-1 text-orange-400 text-xs mt-1">
            <Calendar className="w-3 h-3" />
            <span>{daysLeft}d left on lease</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
