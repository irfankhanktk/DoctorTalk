//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DrPatient_API.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Invitation
    {
        public int Invitaion_ID { get; set; }
        public string From_ID { get; set; }
        public string To_ID { get; set; }
        public Nullable<int> Invitation_Code { get; set; }
        public string Invitation_Type { get; set; }
    }
}
