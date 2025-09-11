import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Password } from 'primereact/password';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { Slider } from 'primereact/slider';
import { Rating } from 'primereact/rating';
import { Knob } from 'primereact/knob';
import { ColorPicker } from 'primereact/colorpicker';
import { ToggleButton } from 'primereact/togglebutton';
import { SelectButton } from 'primereact/selectbutton';
import { ListBox } from 'primereact/listbox';
import { OrderList } from 'primereact/orderlist';
import { PickList } from 'primereact/picklist';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TreeTable } from 'primereact/treetable';
import { DataView } from 'primereact/dataview';
import { VirtualScroller } from 'primereact/virtualscroller';
import { Paginator } from 'primereact/paginator';
import { Tree } from 'primereact/tree';
import { TreeSelect } from 'primereact/treeselect';
import { Timeline } from 'primereact/timeline';
import { OrganizationChart } from 'primereact/organizationchart';
import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Toolbar } from 'primereact/toolbar';
import { MenuBar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { ContextMenu } from 'primereact/contextmenu';
import { MegaMenu } from 'primereact/megamenu';
import { TieredMenu } from 'primereact/tieredmenu';
import { Breadcrumb } from 'primereact/breadcrumb';
import { Steps } from 'primereact/steps';
import { PanelMenu } from 'primereact/panelmenu';
import { TabMenu } from 'primereact/tabmenu';
import { Chart } from 'primereact/chart';
import { Message } from 'primereact/message';
import { Messages } from 'primereact/messages';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Tooltip } from 'primereact/tooltip';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { Skeleton } from 'primereact/skeleton';
import { ScrollTop } from 'primereact/scrolltop';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Image } from 'primereact/image';
import { Carousel } from 'primereact/carousel';
import { Galleria } from 'primereact/galleria';
import { Divider } from 'primereact/divider';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { ScrollPanel } from 'primereact/scrollpanel';
import { BlockUI } from 'primereact/blockui';
import { CapturePhoto } from 'primereact/capturephoto';
import { Terminal } from 'primereact/terminal';
import { SpeedDial } from 'primereact/speeddial';
import { Dock } from 'primereact/dock';
import { DeferredContent } from 'primereact/deferredcontent';
import { InlineMessage } from 'primereact/inlinemessage';
import { Fieldset } from 'primereact/fieldset';
import { AutoComplete } from 'primereact/autocomplete';
import { CascadeSelect } from 'primereact/cascadeselect';
import { Editor } from 'primereact/editor';
import { Mentions } from 'primereact/mentions';
import { KeyFilter } from 'primereact/keyfilter';
import { InputMask } from 'primereact/inputmask';
import { InputSwitch } from 'primereact/inputswitch';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { InputOtp } from 'primereact/inputotp';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inventoryStatus: string;
  rating: number;
}

const PrimeReactShowcase: React.FC = () => {
  // State für verschiedene Komponenten
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedCountries, setSelectedCountries] = useState<any[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [radioValue, setRadioValue] = useState<string>('');
  const [sliderValue, setSliderValue] = useState<number>(50);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [knobValue, setKnobValue] = useState<number>(60);
  const [toggleChecked, setToggleChecked] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [date, setDate] = useState<Date | null>(null);
  const [password, setPassword] = useState<string>('');
  const [numberValue, setNumberValue] = useState<number>(0);
  
  const toast = useRef<Toast>(null);
  const op = useRef<OverlayPanel>(null);
  const messages = useRef<Messages>(null);

  // Sample data
  const cities = [
    { name: 'Berlin', code: 'BER' },
    { name: 'Hamburg', code: 'HAM' },
    { name: 'München', code: 'MUC' },
    { name: 'Köln', code: 'CGN' }
  ];

  const countries = [
    { name: 'Deutschland', code: 'DE' },
    { name: 'Österreich', code: 'AT' },
    { name: 'Schweiz', code: 'CH' }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Solarmodul 400W',
      description: 'Hocheffizientes Photovoltaikmodul',
      price: 299.99,
      category: 'Solar',
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
    {
      id: '2',
      name: 'Wechselrichter 5kW',
      description: 'String-Wechselrichter für PV-Anlagen',
      price: 1299.99,
      category: 'Elektronik',
      inventoryStatus: 'LOWSTOCK',
      rating: 4
    }
  ];

  const chartData = {
    labels: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni'],
    datasets: [
      {
        label: 'Energieproduktion (kWh)',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.4
      }
    ]
  };

  const menuItems = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => toast.current?.show({ severity: 'info', summary: 'Home', detail: 'Home clicked' })
    },
    {
      label: 'Projekte',
      icon: 'pi pi-folder',
      items: [
        { label: 'Neu', icon: 'pi pi-plus' },
        { label: 'Öffnen', icon: 'pi pi-folder-open' }
      ]
    }
  ];

  const showToast = () => {
    toast.current?.show({ severity: 'success', summary: 'Erfolgreich', detail: 'Aktion wurde ausgeführt!' });
  };

  const showConfirm = () => {
    confirmDialog({
      message: 'Sind Sie sicher, dass Sie fortfahren möchten?',
      header: 'Bestätigung',
      icon: 'pi pi-exclamation-triangle',
      accept: () => showToast()
    });
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">PrimeReact Komponenten Showcase</h1>
        <p className="text-gray-600">Alle verfügbaren PrimeReact Komponenten in Aktion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Eingabefelder */}
        <Card title="📝 Eingabefelder" className="h-fit">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Input Text</label>
              <InputText 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="Text eingeben..." 
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Textarea</label>
              <InputTextarea 
                placeholder="Mehrzeiliger Text..." 
                rows={3} 
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Passwort</label>
              <Password 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort..."
                className="w-full"
                toggleMask
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nummer</label>
              <InputNumber 
                value={numberValue}
                onValueChange={(e) => setNumberValue(e.value || 0)}
                showButtons
                min={0}
                max={1000}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Datum</label>
              <Calendar 
                value={date}
                onChange={(e) => setDate(e.value)}
                showIcon
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Auswahlkomponenten */}
        <Card title="🎯 Auswahlkomponenten" className="h-fit">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dropdown</label>
              <Dropdown 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.value)}
                options={cities}
                optionLabel="name"
                placeholder="Stadt wählen..."
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">MultiSelect</label>
              <MultiSelect 
                value={selectedCountries}
                onChange={(e) => setSelectedCountries(e.value)}
                options={countries}
                optionLabel="name"
                placeholder="Länder wählen..."
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={checked}
                onChange={(e) => setChecked(e.checked || false)}
              />
              <label>Checkbox</label>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioButton 
                  value="option1"
                  name="category"
                  checked={radioValue === 'option1'}
                  onChange={(e) => setRadioValue(e.value)}
                />
                <label>Option 1</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioButton 
                  value="option2"
                  name="category"
                  checked={radioValue === 'option2'}
                  onChange={(e) => setRadioValue(e.value)}
                />
                <label>Option 2</label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Toggle Button</label>
              <ToggleButton 
                checked={toggleChecked}
                onChange={(e) => setToggleChecked(e.value)}
                onLabel="An"
                offLabel="Aus"
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Werteeingabe */}
        <Card title="📊 Werteeingabe" className="h-fit">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Slider: {sliderValue}</label>
              <Slider 
                value={sliderValue}
                onChange={(e) => setSliderValue(e.value as number)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <Rating 
                value={ratingValue}
                onChange={(e) => setRatingValue(e.value || 0)}
                stars={5}
                cancel={false}
              />
            </div>
            
            <div className="text-center">
              <label className="block text-sm font-medium mb-2">Knob: {knobValue}%</label>
              <Knob 
                value={knobValue}
                onChange={(e) => setKnobValue(e.value)}
                size={120}
                strokeWidth={8}
                showValue
                valueTemplate="{value}%"
              />
            </div>
          </div>
        </Card>

        {/* Buttons & Actions */}
        <Card title="🔘 Buttons & Actions" className="h-fit">
          <div className="space-y-3">
            <Button 
              label="Primary Button" 
              className="w-full" 
              onClick={showToast}
            />
            <Button 
              label="Secondary" 
              className="w-full p-button-secondary"
              icon="pi pi-cog"
            />
            <Button 
              label="Success" 
              className="w-full p-button-success"
              icon="pi pi-check"
            />
            <Button 
              label="Info" 
              className="w-full p-button-info"
              icon="pi pi-info-circle"
            />
            <Button 
              label="Warning" 
              className="w-full p-button-warning"
              icon="pi pi-exclamation-triangle"
            />
            <Button 
              label="Danger" 
              className="w-full p-button-danger"
              icon="pi pi-times"
            />
            <Button 
              label="Confirm Dialog" 
              className="w-full p-button-outlined"
              onClick={showConfirm}
            />
            <Button 
              label="Show Sidebar" 
              className="w-full p-button-text"
              onClick={() => setSidebarVisible(true)}
            />
          </div>
        </Card>

        {/* Datendarstellung */}
        <Card title="📋 Datendarstellung" className="h-fit">
          <DataTable value={products} className="mb-4">
            <Column field="name" header="Name"></Column>
            <Column field="price" header="Preis" body={(rowData) => `€${rowData.price}`}></Column>
            <Column field="category" header="Kategorie"></Column>
            <Column 
              field="inventoryStatus" 
              header="Status"
              body={(rowData) => (
                <Tag 
                  value={rowData.inventoryStatus} 
                  severity={rowData.inventoryStatus === 'INSTOCK' ? 'success' : 'warning'}
                />
              )}
            />
          </DataTable>
          
          <div className="space-y-2">
            <Badge value="2" className="mr-2">
              <i className="pi pi-bell text-xl"></i>
            </Badge>
            <span>Benachrichtigungen</span>
          </div>
        </Card>

        {/* Charts */}
        <Card title="📈 Charts" className="h-fit">
          <Chart type="line" data={chartData} className="w-full h-64" />
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Fortschritt</span>
              <span>75%</span>
            </div>
            <ProgressBar value={75} />
          </div>
        </Card>

        {/* Layout Komponenten */}
        <Card title="🎨 Layout" className="h-fit">
          <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            <TabPanel header="Tab 1">
              <p>Inhalt von Tab 1</p>
            </TabPanel>
            <TabPanel header="Tab 2">
              <p>Inhalt von Tab 2</p>
            </TabPanel>
          </TabView>
          
          <Accordion className="mt-4">
            <AccordionTab header="Accordion 1">
              <p>Accordion Inhalt 1</p>
            </AccordionTab>
            <AccordionTab header="Accordion 2">
              <p>Accordion Inhalt 2</p>
            </AccordionTab>
          </Accordion>
        </Card>

        {/* Media Komponenten */}
        <Card title="🖼️ Media" className="h-fit">
          <div className="space-y-4">
            <Image 
              src="https://via.placeholder.com/300x200?text=Sample+Image" 
              alt="Sample" 
              width="100%" 
              preview 
            />
            
            <div className="flex space-x-2">
              <Avatar 
                icon="pi pi-user" 
                size="large" 
                shape="circle" 
                style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
              />
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-600">Administrator</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Feedback */}
        <Card title="💬 Feedback" className="h-fit">
          <div className="space-y-4">
            <Message severity="info" text="Info Nachricht" />
            <Message severity="success" text="Erfolg Nachricht" />
            <Message severity="warn" text="Warnung Nachricht" />
            <Message severity="error" text="Fehler Nachricht" />
            
            <Messages ref={messages} />
            
            <Button 
              label="Show Messages" 
              onClick={() => messages.current?.show([
                { severity: 'info', summary: 'Info', detail: 'Nachricht Details', life: 3000 }
              ])}
              className="w-full"
            />
          </div>
        </Card>

        {/* Misc */}
        <Card title="🛠️ Weitere" className="h-fit">
          <div className="space-y-4">
            <Chip label="Chip Label" icon="pi pi-tag" />
            
            <div>
              <Skeleton height="2rem" className="mb-2"></Skeleton>
              <Skeleton height="2rem" className="mb-2"></Skeleton>
              <Skeleton height="2rem"></Skeleton>
            </div>
            
            <ProgressSpinner style={{width: '50px', height: '50px'}} />
            
            <Divider />
            
            <FileUpload 
              mode="basic" 
              name="demo[]" 
              accept="image/*" 
              maxFileSize={1000000}
              chooseLabel="Datei wählen"
            />
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)}>
        <h3>Sidebar Inhalt</h3>
        <p>Dies ist ein Sidebar Panel</p>
        <Button 
          label="Schließen" 
          onClick={() => setSidebarVisible(false)}
          className="mt-4"
        />
      </Sidebar>

      {/* Dialog */}
      <Dialog 
        visible={visible}
        onHide={() => setVisible(false)}
        header="Dialog Titel"
        style={{ width: '450px' }}
      >
        <p>Dialog Inhalt hier...</p>
        <div className="flex justify-end mt-4">
          <Button 
            label="Schließen" 
            onClick={() => setVisible(false)}
          />
        </div>
      </Dialog>

      {/* OverlayPanel */}
      <OverlayPanel ref={op}>
        <div className="p-4">
          <h4>Overlay Panel</h4>
          <p>Zusätzliche Informationen hier...</p>
        </div>
      </OverlayPanel>

      {/* ScrollTop */}
      <ScrollTop />
    </div>
  );
};

export default PrimeReactShowcase;