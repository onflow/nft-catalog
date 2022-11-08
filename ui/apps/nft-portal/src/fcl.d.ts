// There are separate efforts making real typescript support for FCL.
// This is just a placeholder for when those come to fruition, and we can
// plug it in here.

declare module '@onflow/interaction-template-generators' {
  function template(...any): any;
  function messages(...any): any;
  function message(...any): any;
  function messageTranslation(...any): any;
  function type(...any): any;
  function cadence(...any): any;
  function iface(...any): any;
  function args(...any): any;
  function arg(...any): any;
  function dependencies(...any): any;
  function dependency(...any): any;
  function dependencyContract(...any): any;
  function dependencyContractByNetwork(...any): any;
}

declare module '@onflow/fcl' {
  function currentUser(): any;
  function authenticate(): any;
  function logIn(): any;
  function getAccount(address: any): any;
  function account(address: any): any;
  function script(): any;
  function transaction(): any;
  function withPrefix(addr): any;
  function sansPrefix(addr): any;
  function config(...args): any;
  function query(args): any;
  function mutate(args): any;
  function tx(args: any);
  function send(args: any);
  function script(args: any);
  function decode();
  function args(args): any;
  function arg(arg1, arg2): any;
  function unauthenticate(): any;
  

  var InteractionTemplateUtils: {
    getInteractionTemplateAudits: function(...any): any;
  }
}

declare module '@onflow/types' {
  Address: string;
  String: string;
  Path: string;
  function Address(): any;
  function String(): any;
  function Path(): any;
  function UInt64(): any;
}

declare module '@onflow/transport-http' {
  function send(): any;
}
