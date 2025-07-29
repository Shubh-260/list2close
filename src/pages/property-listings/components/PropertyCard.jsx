import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PropertyCard = ({ property, onEdit, onViewAnalytics, onToggleSyndication }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-success text-success-foreground',
      'Pending': 'bg-warning text-warning-foreground',
      'Sold': 'bg-accent text-accent-foreground',
      'Draft': 'bg-muted text-muted-foreground',
      'Expired': 'bg-destructive text-destructive-foreground'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getSyndicationStatus = () => {
    const total = property.syndication.length;
    const active = property.syndication.filter(s => s.status === 'Active').length;
    return { active, total };
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const syndicationStatus = getSyndicationStatus();

  return (
    <div 
      className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <Image
          src={property.images[currentImageIndex]}
          alt={`${property.address} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
        </div>

        {/* Virtual Tour Badge */}
        {property.hasVirtualTour && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full flex items-center gap-1">
              <Icon name="Video" size={12} />
              Virtual Tour
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price and Type */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground">
            {formatPrice(property.price)}
          </h3>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
            {property.type}
          </span>
        </div>

        {/* Address */}
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
          <Icon name="MapPin" size={14} />
          {property.address}
        </p>

        {/* Property Details */}
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Bed" size={14} />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Bath" size={14} />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Square" size={14} />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Syndication Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="Globe" size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Syndicated to {syndicationStatus.active}/{syndicationStatus.total} platforms
            </span>
          </div>
          <div className="flex gap-1">
            {property.syndication.slice(0, 3).map((platform, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  platform.status === 'Active' ? 'bg-success' : 'bg-muted'
                }`}
                title={`${platform.name}: ${platform.status}`}
              />
            ))}
          </div>
        </div>

        {/* Performance Metrics (shown on hover) */}
        {isHovered && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-foreground">{property.views}</div>
                <div className="text-xs text-muted-foreground">Views</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-foreground">{property.inquiries}</div>
                <div className="text-xs text-muted-foreground">Inquiries</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-foreground">{property.showings}</div>
                <div className="text-xs text-muted-foreground">Showings</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => onEdit(property)}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="BarChart3"
            iconPosition="left"
            onClick={() => onViewAnalytics(property)}
            className="flex-1"
          >
            Analytics
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Globe"
            onClick={() => onToggleSyndication(property)}
          >
            <Icon name="Globe" size={16} />
          </Button>
        </div>

        {/* Last Updated */}
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Updated {property.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;