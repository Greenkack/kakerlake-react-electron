// packages/core/src/types/db.ts
// Generated from Python sources: crm.py, database.py, product_db.py
// Schema Version 14 - Complete CRM & Product Database Types

export interface Customer {
  id?: number;
  salutation?: string;
  title?: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  address?: string;
  house_number?: string;
  zip_code?: string;
  city?: string;
  state?: string;
  region?: string;
  email?: string;
  phone_landline?: string;
  phone_mobile?: string;
  income_tax_rate_percent?: number;
  creation_date?: string;
  last_updated?: string;
}

export interface Project {
  id?: number;
  customer_id: number;
  project_name: string;
  project_status?: string;
  roof_type?: string;
  roof_covering_type?: string;
  free_roof_area_sqm?: number;
  roof_orientation?: string;
  roof_inclination_deg?: number;
  building_height_gt_7m?: number;
  annual_consumption_kwh?: number;
  costs_household_euro_mo?: number;
  annual_heating_kwh?: number;
  costs_heating_euro_mo?: number;
  anlage_type?: string;
  feed_in_type?: string;
  module_quantity?: number;
  selected_module_id?: number;
  selected_inverter_id?: number;
  include_storage?: number;
  selected_storage_id?: number;
  selected_storage_storage_power_kw?: number;
  include_additional_components?: number;
  selected_wallbox_id?: number;
  selected_ems_id?: number;
  selected_optimizer_id?: number;
  selected_carport_id?: number;
  selected_notstrom_id?: number;
  selected_tierabwehr_id?: number;
  visualize_roof_in_pdf?: number;
  latitude?: number;
  longitude?: number;
  creation_date?: string;
  last_updated?: string;
}

export interface CustomerDocument {
  id?: number;
  customer_id: number;
  project_id?: number;
  doc_type?: string; // 'offer_pdf', 'image', 'note', 'other'
  display_name?: string;
  file_name?: string;
  absolute_file_path?: string;
  uploaded_at?: string;
}

export interface Product {
  id?: number;
  category: string;
  model_name: string;
  brand?: string;
  price_euro?: number;
  capacity_w?: number;
  storage_power_kw?: number;
  power_kw?: number;
  max_cycles?: number;
  warranty_years?: number;
  length_m?: number;
  width_m?: number;
  weight_kg?: number;
  efficiency_percent?: number;
  origin_country?: string;
  description?: string;
  pros?: string;
  cons?: string;
  rating?: number;
  image_base64?: string;
  created_at?: string;
  updated_at?: string;
  datasheet_link_db_path?: string;
  additional_cost_netto?: number;
  company_id?: number;
  cell_technology?: string;
  module_structure?: string;
  cell_type?: string;
  version?: string;
  module_warranty_text?: string;
  labor_hours?: number;
}

// PDF Generation Options - mirrors pdf_ui.py checkbox structure
export interface PDFGenerationOptions {
  extended_pages?: boolean;
  wp_additional_pages?: boolean;
  include_charts?: boolean;
  include_company_docs?: boolean;
}

// Analysis Results structure for PDF generation
export interface AnalysisResults {
  base_matrix_price_netto?: number;
  total_investment_netto?: number;
  total_investment_brutto?: number;
  final_price?: number;
  einspeiseverguetung_jahr_euro?: number;
  annual_pv_production_kwh?: number;
  anlage_kwp?: number;
  // Additional analysis fields as needed
  [key: string]: any;
}

// Project Data for PDF generation - mirrors Python project_data structure
export interface ProjectData {
  customer_information?: Customer;
  company_information?: any;
  project_details?: Project;
  selected_products?: {
    module?: Product;
    inverter?: Product;
    storage?: Product;
    wallbox?: Product;
    ems?: Product;
    optimizer?: Product;
    carport?: Product;
    notstrom?: Product;
    tierabwehr?: Product;
  };
  [key: string]: any;
}

// CRUD Repository Interfaces - mirror Python function signatures exactly

export interface CustomerRepository {
  // Mirrors crm.py:save_customer
  saveCustomer(customerData: Customer): Promise<number | null>;
  
  // Mirrors crm.py:load_customer  
  loadCustomer(customerId: number): Promise<Customer | null>;
  
  // Mirrors crm.py:delete_customer
  deleteCustomer(customerId: number): Promise<boolean>;
  
  // Mirrors crm.py:load_all_customers
  loadAllCustomers(): Promise<Customer[]>;
}

export interface ProjectRepository {
  // Mirrors crm.py:save_project
  saveProject(projectData: Project): Promise<number | null>;
  
  // Mirrors crm.py:load_project
  loadProject(projectId: number): Promise<Project | null>;
  
  // Mirrors crm.py:delete_project
  deleteProject(projectId: number): Promise<boolean>;
  
  // Mirrors crm.py:load_projects_for_customer
  loadProjectsForCustomer(customerId: number): Promise<Project[]>;
}

export interface CustomerDocumentRepository {
  // Mirrors database.py:add_customer_document
  addCustomerDocument(
    customerId: number, 
    fileBytes: Uint8Array, 
    displayName: string, 
    docType?: string, 
    projectId?: number, 
    suggestedFilename?: string
  ): Promise<number | null>;
  
  // Mirrors database.py:list_customer_documents
  listCustomerDocuments(customerId: number, docType?: string): Promise<CustomerDocument[]>;
  
  // Mirrors database.py:delete_customer_document
  deleteCustomerDocument(documentId: number): Promise<boolean>;
}

export interface ProductRepository {
  // Mirrors product_db.py:add_product
  addProduct(productData: Product): Promise<number | null>;
  
  // Mirrors product_db.py:list_products
  listProducts(category?: string, companyId?: number): Promise<Product[]>;
  
  // Mirrors product_db.py:get_product_by_id
  getProductById(productId: number): Promise<Product | null>;
  
  // Mirrors product_db.py:update_product
  updateProduct(productId: number, productData: Product): Promise<boolean>;
  
  // Mirrors product_db.py:delete_product
  deleteProduct(productId: number): Promise<boolean>;
}

// PDF Generation Bridge Interface - mirrors pdf_generator.py:generate_offer_pdf
export interface PDFGenerator {
  generateOfferPdf(
    projectData: ProjectData,
    analysisResults: AnalysisResults,
    options?: PDFGenerationOptions
  ): Promise<{ success: boolean; filePath?: string; error?: string }>;
}

// Streamlit Form Field Types - for React form replication
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  validation?: (value: any) => string | null;
}
