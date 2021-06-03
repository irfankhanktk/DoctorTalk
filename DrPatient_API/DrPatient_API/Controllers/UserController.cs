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
    public class UserController : ApiController
    {
        private DoctorPatientEntities db = new DoctorPatientEntities();
        [HttpGet]
        public IHttpActionResult GetRejectedDoctors()
        {
           
            try
            {
                var rows = db.Users.Where(u => u.IsRejected == true && u.Role=="Doctor").ToList();
                return Ok(rows);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        public IHttpActionResult GetetApprovedDoctors()
        {
            try
            {
                var rows = db.Users.Where(u => u.IsApproved == true && u.Role == "Doctor").ToList();
                return Ok(rows);
            }
            catch (Exception)
            {

                throw;
            }
           
        }
        [HttpGet]
        public IHttpActionResult GetUnApprovedDoctors()
        {
            try
            {
                var rows = db.Users.Where(u => u.IsApproved == false && u.Role == "Doctor").ToList();
                return Ok(rows);
            }
            catch (Exception)
            {

                throw;
            }
           
        }
        [HttpGet]
        public IHttpActionResult Invite(string From_ID, string To_ID)
        {
            var row = db.Invitations.Where(x=>x.From_ID==From_ID&&x.To_ID==To_ID).FirstOrDefault();
            if (row != null)
            {
                return BadRequest();
            }
            int code = new Random().Next(10000);
            Invitation invitation = new Invitation();
            invitation.From_ID = From_ID;
            invitation.To_ID = To_ID;
            invitation.Invitation_Type = "Requested";
            invitation.Invitation_Code = code;
            db.Invitations.Add(invitation);
            db.SaveChanges();
            return Ok(invitation);
        }
        [HttpGet]
        public IHttpActionResult InvitationCode(string Phone,int code, string name)
        {
            var row = db.Invitations.Where(x=>x.To_ID== Phone&&x.Invitation_Code==code&&x.Invitation_Type=="Requested").FirstOrDefault();
            if (row == null)
            {
                return BadRequest();
            }

            row.Invitation_Type = "Accepted";
            db.Entry(row).State = EntityState.Modified;
            try
            {
                db.SaveChanges();
            }
            catch (Exception)
            {

                throw;
            }
            User user = new User();
            user.Phone = Phone;
            user.Name = name;
            user.Role = "Patient";
            var u = db.Users.Add(user);

            try
            {
                db.SaveChanges();
                return Ok(u);
            }
            catch (Exception ex)
            {
                return BadRequest(ex + "");
            }
        }
        [HttpGet]
        public IHttpActionResult IsUser(string Phone)
        {
            var row = db.Users.Where(u=>u.Phone==Phone).FirstOrDefault();
            if (row != null)
            {
                return Ok(row);
            }
            return BadRequest();
        }
        public IHttpActionResult GetUsers(string Phone)
        {
            var friends=db.Friends.Where(f=>f.From_ID==Phone||f.To_ID==Phone);
            List<string> vs = new List<string>();
            foreach (var item in friends)
            {
                var row =(UserFriendView) db.Users.Where(u => u.Phone != Phone && (u.Phone == item.To_ID || u.Phone == item.From_ID)).FirstOrDefault();
                if (item.To_ID == Phone)
                {
                    row.IsBlock_ByMe = item.IsBlock_To;
                    vs.Add(item.From_ID);
                }
                else
                {
                    row.IsBlock_ByFriend = item.IsBlock_From;
                    vs.Add(item.To_ID);
                }
                row.Friend_Type = item.Friend_Type;
            }
            var ufv2 = new List<UserFriendView>();
            var ulist = db.Users.Where(u => u.Phone != Phone && !vs.Contains(u.Phone)&&u.Role!="Admin").ToList();
            foreach (var item in ulist)
            {
                var row = (UserFriendView)item;
                ufv2.Add(row);
            }
  
            return Ok(ufv2);
        }

        // GET: api/User/5
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(string id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PUT: api/User/5
        [HttpPost]
        public IHttpActionResult UpdateImage(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var u = db.Users.Where(x=>x.Phone==user.Phone).FirstOrDefault();
            if (u==null)
            {
                return BadRequest();
            }
            u.Image = user.Image;
            db.Entry(u).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
               
                    throw;
         
            }

            return Ok(u);
        }

        // POST: api/User
        [ResponseType(typeof(User))]
        public IHttpActionResult PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var u=db.Users.Add(user);

            try
            {
                db.SaveChanges();
                return Ok(u);
            }
            catch (Exception ex)
            {
              return  BadRequest(ex+"");
            }

        }

        // DELETE: api/User/5
        [ResponseType(typeof(User))]
        public IHttpActionResult DeleteUser(string id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            db.SaveChanges();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(string id)
        {
            return db.Users.Count(e => e.Phone == id) > 0;
        }
    }
}