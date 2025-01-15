import type { Schema, Struct } from '@strapi/strapi';

export interface CustomTypesAddress extends Struct.ComponentSchema {
  collectionName: 'components_custom_types_addresses';
  info: {
    displayName: 'address';
    icon: 'bulletList';
  };
  attributes: {
    additional_info: Schema.Attribute.String;
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    postal_code: Schema.Attribute.String;
    state: Schema.Attribute.String;
    street: Schema.Attribute.String;
  };
}

export interface CustomTypesOpeningHours extends Struct.ComponentSchema {
  collectionName: 'components_custom_types_opening_hours';
  info: {
    displayName: 'Opening hours';
    icon: 'chartCircle';
  };
  attributes: {
    closingTime: Schema.Attribute.Time;
    dayOfWeek: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<
        'plugin::multi-select.multi-select',
        [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ]
      > &
      Schema.Attribute.DefaultTo<'[]'>;
    openingTime: Schema.Attribute.Time;
  };
}

export interface CustomTypesPhone extends Struct.ComponentSchema {
  collectionName: 'components_custom_types_phones';
  info: {
    displayName: 'phone';
  };
  attributes: {
    number: Schema.Attribute.String;
    prefix: Schema.Attribute.String & Schema.Attribute.DefaultTo<'+34'>;
  };
}

export interface CustomTypesRedsysData extends Struct.ComponentSchema {
  collectionName: 'components_custom_types_redsys_data';
  info: {
    description: '';
    displayName: 'redsysData';
  };
  attributes: {
    merchantCode: Schema.Attribute.String;
    merchantName: Schema.Attribute.String;
    merchantTerminal: Schema.Attribute.String;
    secretKey: Schema.Attribute.Password;
  };
}

export interface ProductComplement extends Struct.ComponentSchema {
  collectionName: 'components_product_complements';
  info: {
    displayName: 'Complement';
  };
  attributes: {
    name: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'custom-types.address': CustomTypesAddress;
      'custom-types.opening-hours': CustomTypesOpeningHours;
      'custom-types.phone': CustomTypesPhone;
      'custom-types.redsys-data': CustomTypesRedsysData;
      'product.complement': ProductComplement;
    }
  }
}
