import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


import { generatePropertyDescription, analyzePropertyImages } from '../../../services/propertyDescriptionService';

const AddListingModal = ({ isOpen, onClose, onSave, property, uploadedImages, removeImage }) => {
  const [formData, setFormData] = useState({
    address: '',
    price: '',
    type: 'Single Family',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    yearBuilt: '',
    lotSize: '',
    description: '',
    features: [],
    images: [],
    status: 'Draft'
  });

  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isAnalyzingImages, setIsAnalyzingImages] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState(null);

  const propertyTypes = [
  { value: 'single-family', label: 'Single Family' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'multi-family', label: 'Multi-Family' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' }];


  const propertyFeatures = [
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'garage', label: 'Garage' },
  { id: 'fireplace', label: 'Fireplace' },
  { id: 'hardwood', label: 'Hardwood Floors' },
  { id: 'updated-kitchen', label: 'Updated Kitchen' },
  { id: 'master-suite', label: 'Master Suite' },
  { id: 'walk-in-closet', label: 'Walk-in Closet' },
  { id: 'laundry-room', label: 'Laundry Room' },
  { id: 'patio', label: 'Patio/Deck' },
  { id: 'garden', label: 'Garden' }];


  const handleGenerateDescription = async () => {
    if (!formData.address || !formData.price) {
      alert('Please fill in address and price before generating description');
      return;
    }

    setIsGeneratingDescription(true);

    try {
      const generatedContent = await generatePropertyDescription({
        address: formData.address,
        price: parseInt(formData.price),
        type: formData.type,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        sqft: parseInt(formData.sqft),
        yearBuilt: parseInt(formData.yearBuilt),
        lotSize: formData.lotSize,
        features: formData.features,
        neighborhood: extractNeighborhood(formData.address),
        schoolDistrict: 'Local School District' // Could be enhanced with real data
      });

      setAiGeneratedContent(generatedContent);

      // Auto-populate the description field
      setFormData((prev) => ({
        ...prev,
        description: generatedContent.fullDescription
      }));

      console.log('Generated property content:', generatedContent);
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleAnalyzeImages = async () => {
    if (formData.images.length === 0) {
      alert('Please add images before analyzing');
      return;
    }

    setIsAnalyzingImages(true);

    try {
      // For now, we'll just call the service without actual image data // In a real implementation, you'd pass the actual image URLs
      const analysis = await analyzePropertyImages(formData.images);

      console.log('Image analysis results:', analysis);

      // Add suggested features from image analysis
      const newFeatures = [...formData.features];
      analysis.identifiedFeatures.forEach((feature) => {
        if (!newFeatures.includes(feature)) {
          newFeatures.push(feature);
        }
      });

      setFormData((prev) => ({
        ...prev,
        features: newFeatures
      }));

      alert(`AI identified ${analysis.identifiedFeatures.length} features from your images!`);
    } catch (error) {
      console.error('Error analyzing images:', error);
      alert('Failed to analyze images. Please try again.');
    } finally {
      setIsAnalyzingImages(false);
    }
  };

  const extractNeighborhood = (address) => {
    // Simple extraction - in real app, you'd use a proper address parser
    const parts = address.split(',');
    return parts.length > 1 ? parts[1].trim() : '';
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Include AI-generated content in the save data
    const dataToSave = {
      ...formData,
      aiGeneratedContent,
      price: parseInt(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseFloat(formData.bathrooms),
      sqft: parseInt(formData.sqft),
      yearBuilt: parseInt(formData.yearBuilt)
    };

    onSave(dataToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {property ? 'Edit Listing' : 'Add New Listing'}
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Property Address *
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street, City, State 12345"
                  required />

              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price *
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="750000"
                  required />

              </div>
            </div>

            <Input
              label="Property Type"
              type="text"
              placeholder="Single Family"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              required />

            
            <Input
              label="Bedrooms"
              type="number"
              placeholder="3"
              value={formData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', e.target.value)}
              required />

            
            <Input
              label="Bathrooms"
              type="number"
              step="0.5"
              placeholder="2.5"
              value={formData.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', e.target.value)}
              required />

            
            <Input
              label="Square Feet"
              type="number"
              placeholder="2500"
              value={formData.sqft}
              onChange={(e) => handleInputChange('sqft', e.target.value)}
              required
              className="md:col-span-2" />

          </div>

          {/* AI-Powered Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">AI-Powered Features</h3>
            
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateDescription}
                disabled={isGeneratingDescription}
                iconName="Sparkles"
                iconPosition="left">

                {isGeneratingDescription ? 'Generating...' : 'AI Generate Description'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleAnalyzeImages}
                disabled={isAnalyzingImages || formData.images.length === 0}
                iconName="Image"
                iconPosition="left">

                {isAnalyzingImages ? 'Analyzing...' : 'AI Analyze Images'}
              </Button>
            </div>

            {aiGeneratedContent &&
            <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">AI Generated Content:</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Headline:</strong> {aiGeneratedContent.headline}</div>
                  <div><strong>Key Features:</strong> {aiGeneratedContent.keyFeatures?.join(', ')}</div>
                  <div><strong>SEO Keywords:</strong> {aiGeneratedContent.seoKeywords?.join(', ')}</div>
                </div>
              </div>
            }
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Property Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the property features, neighborhood, and unique selling points..."
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical min-h-[120px]"
              rows={6} />

            <p className="text-sm text-muted-foreground mt-1">
              Use the "AI Generate Description" button above to create compelling copy automatically
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Property Images
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload" />

              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2">

                <Icon name="Upload" size={32} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload images or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </label>
            </div>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 &&
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {uploadedImages.map((image) =>
              <div key={image.id} className="relative group">
                    <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-24 object-cover rounded-lg border border-border" />

                    <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">

                      <Icon name="X" size={12} />
                    </button>
                    <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded text-center">
                      AI Tagged
                    </div>
                  </div>
              )}
              </div>
            }
          </div>
        </form>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}>

            Cancel
          </Button>
          <Button
            type="submit"
            variant="default">

            {property ? 'Update Listing' : 'Create Listing'}
          </Button>
        </div>
      </div>
    </div>);

};

export default AddListingModal;