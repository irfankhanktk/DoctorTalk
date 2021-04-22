using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DrPatient_API.Models
{
    public class UserFriendView
    {

        public int Friend_ID { get; set; }
        public string Phone { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Role { get; set; }
        public Nullable<bool> IsApproved { get; set; }
        public Nullable<bool> IsRejected { get; set; }
        //public string  { get; set; }
        public Nullable<bool> IsBlock_ByMe { get; set; }
        public Nullable<bool> IsBlock_ByFriend { get; set; }
        public string Friend_Type { get; set; }

        public static explicit operator UserFriendView(User v)
        {
            UserFriendView ufv = new UserFriendView();

            ufv.Phone = v.Phone;
            ufv.Name = v.Name;
            ufv.Image = v.Image;
            ufv.Role = v.Role;
            ufv.IsApproved = v.IsApproved;
            ufv.IsRejected = v.IsRejected;
            
            return ufv;

        }
    }
}