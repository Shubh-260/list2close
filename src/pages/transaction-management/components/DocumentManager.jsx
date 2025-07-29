import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DocumentManager = ({ transaction, isOpen, onClose }) => {
  const [documents, setDocuments] = useState(transaction?.documents || []);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const documentCategories = [
    { value: 'all', label: 'All Documents' },
    { value: 'contract', label: 'Contracts' },
    { value: 'inspection', label: 'Inspections' },
    { value: 'appraisal', label: 'Appraisals' },
    { value: 'financing', label: 'Financing' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'closing', label: 'Closing Documents' },
    { value: 'other', label: 'Other' }
  ];

  const documentTemplates = [
    { name: 'Purchase Agreement', category: 'contract', required: true },
    { name: 'Inspection Report', category: 'inspection', required: true },
    { name: 'Appraisal Report', category: 'appraisal', required: true },
    { name: 'Loan Application', category: 'financing', required: true },
    { name: 'Insurance Policy', category: 'insurance', required: true },
    { name: 'Title Report', category: 'closing', required: true },
    { name: 'Closing Disclosure', category: 'closing', required: true }
  ];

  const handleFileUpload = async (files, category = 'other') => {
    const fileArray = Array.from(files);
    
    // Add files to uploading state
    const uploadingItems = fileArray.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading'
    }));
    
    setUploadingFiles(prev => [...prev, ...uploadingItems]);

    // Simulate upload progress
    for (const item of uploadingItems) {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadingFiles(prev => 
          prev.map(f => f.id === item.id ? { ...f, progress } : f)
        );
      }

      // Add to documents when complete
      const newDocument = {
        id: Date.now() + Math.random(),
        name: item.name,
        type: category,
        status: 'uploaded',
        uploadDate: new Date().toISOString().split('T')[0],
        size: item.size,
        url: URL.createObjectURL(fileArray.find(f => f.name === item.name))
      };

      setDocuments(prev => [...prev, newDocument]);
      setUploadingFiles(prev => prev.filter(f => f.id !== item.id));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const getDocumentIcon = (type) => {
    const icons = {
      contract: 'FileText',
      inspection: 'Search',
      appraisal: 'DollarSign',
      financing: 'CreditCard',
      insurance: 'Shield',
      closing: 'Key',
      other: 'File'
    };
    return icons[type] || 'File';
  };

  const getStatusColor = (status) => {
    const colors = {
      uploaded: 'bg-success text-success-foreground',
      pending: 'bg-warning text-warning-foreground',
      signed: 'bg-primary text-primary-foreground',
      rejected: 'bg-destructive text-destructive-foreground'
    };
    return colors[status] || colors.uploaded;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Document Manager</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {transaction?.id} - {transaction?.property?.address}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-border p-4 overflow-y-auto">
            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center mb-6 hover:border-primary transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop files here or click to browse
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" size="sm" as="span">
                  Choose Files
                </Button>
              </label>
            </div>

            {/* Document Templates */}
            <div className="mb-6">
              <h3 className="font-medium text-foreground mb-3">Required Documents</h3>
              <div className="space-y-2">
                {documentTemplates.map((template, index) => {
                  const hasDocument = documents.some(doc => 
                    doc.name.toLowerCase().includes(template.name.toLowerCase())
                  );
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        hasDocument ? 'bg-success/10' : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon 
                          name={hasDocument ? "CheckCircle" : "Circle"} 
                          size={16} 
                          className={hasDocument ? "text-success" : "text-muted-foreground"}
                        />
                        <span className="text-sm text-foreground">{template.name}</span>
                      </div>
                      {template.required && (
                        <span className="text-xs text-destructive">Required</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Uploading Files */}
            {uploadingFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-foreground mb-3">Uploading</h3>
                <div className="space-y-2">
                  {uploadingFiles.map((file) => (
                    <div key={file.id} className="p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">{file.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1">
                        <div 
                          className="bg-primary h-1 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                options={documentCategories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                className="w-48"
              />
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name={getDocumentIcon(document.type)} size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{document.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {document.uploadDate} • {formatFileSize(document.size)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" iconName="Eye" className="flex-1">
                      View
                    </Button>
                    <Button variant="outline" size="sm" iconName="Download">
                      <Icon name="Download" size={16} />
                    </Button>
                    <Button variant="outline" size="sm" iconName="MoreHorizontal">
                      <Icon name="MoreHorizontal" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">No documents found</h3>
                <p className="text-muted-foreground">
                  Upload documents or adjust your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {documents.length} documents • {uploadingFiles.length} uploading
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" iconName="Share">
              Share Access
            </Button>
            <Button variant="default" iconName="Download">
              Download All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;