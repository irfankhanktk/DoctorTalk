using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using DrPatient_API.Models;

namespace DrPatient_API.Controllers
{
    public class FriendController : ApiController
    {
        private DoctorPatientEntities db = new DoctorPatientEntities();

        [HttpGet]
        public IHttpActionResult GetFriends(string Phone)
        {
            var friends = db.Friends.Where(f => f.From_ID == Phone || f.To_ID == Phone);
            List<UserFriendView> ufv = new List<UserFriendView>();
            foreach (var item in friends)
            {
                var row = (UserFriendView)db.Users.Where(u => u.Phone != Phone && (u.Phone == item.To_ID || u.Phone == item.From_ID)).FirstOrDefault();
                row.Friend_ID = item.Friend_ID;
                if (item.To_ID == Phone)
                {
                    row.IsBlock_ByMe = item.IsBlock_To;
                }
                else
                {
                    row.IsBlock_ByMe = item.IsBlock_From;
                }
                if (item.To_ID != Phone)
                {
                    row.IsBlock_ByFriend = item.IsBlock_To;

                }
                else
                {
                    row.IsBlock_ByFriend = item.IsBlock_From;
                }

                row.Friend_Type = item.Friend_Type;
                ufv.Add(row);

            }
            
            return Ok(ufv);
        }
        [HttpGet]
        public IHttpActionResult AlterRequest(int Friend_ID,string Friend_Type)
        {
            var row = db.Friends.Where(f=>f.Friend_ID==Friend_ID).FirstOrDefault();
            if (row != null)
            {
                row.Friend_Type = Friend_Type;
                db.Entry(row).State = EntityState.Modified;
                try
                {
                    db.SaveChanges();
                }
                catch (Exception)
                {

                    throw;
                }
            }
            return Ok();
        }
        [HttpGet]
        public IHttpActionResult GetFriendRequests(string Phone)
        {
            var friends = db.Friends.Where(f => f.To_ID == Phone&&f.Friend_Type =="Requested");
            List<UserFriendView> ufv = new List<UserFriendView>();
            foreach (var item in friends)
            {
                var row = (UserFriendView)db.Users.Where(u =>u.Phone == item.From_ID).FirstOrDefault();
                row.Friend_ID = item.Friend_ID;
                row.IsBlock_ByMe = item.IsBlock_From;
                row.IsBlock_ByFriend = item.IsBlock_To;
                row.Friend_Type = item.Friend_Type;
                ufv.Add(row);
            }
            return Ok(ufv);
        }
        [HttpGet]
        public IHttpActionResult BlockFriend(int Friend_ID,string User_Phone)
        {
            var row = db.Friends.Where(f=>f.Friend_ID==Friend_ID).FirstOrDefault();
            if (row != null)
            {
                if(row.From_ID==User_Phone)
                {
                    row.IsBlock_From = true;
                }
                else
                {
                    row.IsBlock_To = true;
                }
                db.Entry(row).State = EntityState.Modified;
                try
                {
                    db.SaveChanges();
                }
                catch (Exception)
                {

                    throw;
                }
            }
            return Ok(row);
        }
        [HttpGet]
        public IHttpActionResult UnBlockFriend(int Friend_ID, string User_Phone)
        {
            var row = db.Friends.Where(f => f.Friend_ID == Friend_ID).FirstOrDefault();
            if (row != null)
            {
                if (row.From_ID == User_Phone)
                {
                    row.IsBlock_From = false;
                }
                else
                {
                    row.IsBlock_To = false;
                }
                db.Entry(row).State = EntityState.Modified;
                try
                {
                    db.SaveChanges();
                }
                catch (Exception)
                {

                    throw;
                }
            }
            return Ok(row);
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}