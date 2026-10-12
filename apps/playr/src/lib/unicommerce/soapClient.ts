/**
 * Unicommerce Base SOAP Client with WS-Security
 */

import { getUnicommerceConfig, buildUnicommerceSoapUrl } from './config';

export function getTagValue(xml: string, tagName: string): string {
  const regex = new RegExp(`<([^>:]+:)?${tagName}(\\s[^>]*|\\s*)>([\\s\\S]*?)<\\/\\1?${tagName}>`);
  const match = xml.match(regex);
  if (!match) return '';
  return match[3].trim().replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
}

export async function soapRequest<T>(
  operation: string,
  xmlBody: string,
  options: { facilityCode?: string } = {}
): Promise<T> {
  const config = getUnicommerceConfig();
  const facility = options.facilityCode || config.facilityCode;
  const url = buildUnicommerceSoapUrl(config.apiUrl, facility);

  const soapEnvelope = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://uniware.unicommerce.com/services/">
  <soapenv:Header>
    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
      <wsse:UsernameToken>
        <wsse:Username>${config.username}</wsse:Username>
        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${config.password}</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </soapenv:Header>
  <soapenv:Body>
    ${xmlBody}
  </soapenv:Body>
</soapenv:Envelope>`;

  const headers: Record<string, string> = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': operation,
    'Facility': facility,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: soapEnvelope,
    signal: AbortSignal.timeout(15000),
  });

  const responseXml = await response.text();
  const isSuccessful = getTagValue(responseXml, 'successful') === 'true';
  const code = getTagValue(responseXml, 'code');
  const message = getTagValue(responseXml, 'message');

  return {
    successful: isSuccessful,
    code,
    message,
    rawXml: responseXml,
  } as unknown as T;
}
