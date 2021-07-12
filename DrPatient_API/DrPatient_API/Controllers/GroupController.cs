using DrPatient_API.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DrPatient_API.Controllers
{
    public class GroupController : ApiController
    {
        private DoctorPatientEntities db = new DoctorPatientEntities();
        [HttpPost]
        public IHttpActionResult CreateGroup(Group group)
        {
            var row = db.Groups.Where(x=>x.G_Name==group.G_Name).FirstOrDefault();
            if (row==null)
            {
                var res = db.Groups.Add(group);
            }
            else
            {
                return BadRequest("Already exist");
            }
            return Ok();
        }
        [HttpGet]
        public IHttpActionResult AddMember(int G_ID,string  Phone)
        {
            var row = db.Groups.Where(x => x.G_ID == G_ID).FirstOrDefault();
            if (row == null)
            {
                return BadRequest("BadRequest");
            }
            else
            {
                var isExist = row.G_MemberIDs.Contains(Phone);
                if (isExist)
                {
                    return BadRequest("Already exist");
                }
                row.G_MemberIDs += "," + Phone;
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
        public IHttpActionResult RemoveMember(int G_ID, string Phone)
        {
            var row = db.Groups.Where(x => x.G_ID == G_ID).FirstOrDefault();
            if (row == null)
            {
                return BadRequest("BadRequest");
            }
            else
            {
                var mIds=row.G_MemberIDs.Split(',');
                List<string> newMids = new List<string>();
                for (int i = 0; i < mIds.Length; i++)
                {
                    if (mIds[i] != Phone)
                    {
                        newMids.Add(mIds[i]);
                    }
                }
                row.G_MemberIDs= String.Join(",", newMids);
                db.Entry(row).State = EntityState.Modified;
                try
                {
                    db.SaveChanges();
                }
                catch (Exception)
                {
                    throw;
                }

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
        public IHttpActionResult GetGroups(string Phone)
        {
            var rows = db.Groups.Where(x => x.G_MemberIDs.Contains(Phone)).ToList();
            return Ok(rows);
        }
        [HttpGet]
        public IHttpActionResult GetAllGroups()
        {
            var rows = db.Groups.Select(x=>x).ToList();
            return Ok(rows);
        }
    }
}
